<?php

namespace App\Services;

use App\Models\Payment;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeService
{
    private string $secretKey;

    private string $webhookSecret;

    public function __construct()
    {
        $this->secretKey = config('services.stripe.secret');
        $this->webhookSecret = config('services.stripe.webhook_secret');
        Stripe::setApiKey($this->secretKey);
    }

    public function createPaymentIntent(Payment $payment): array
    {
        $intent = PaymentIntent::create([
            'amount' => (int) ($payment->amount * 100),
            'currency' => strtolower($payment->currency),
            'metadata' => [
                'payment_id' => $payment->id,
                'payment_type' => $payment->payment_type,
            ],
        ]);

        $payment->update(['gateway_order_id' => $intent->id]);

        return [
            'client_secret' => $intent->client_secret,
            'intent_id' => $intent->id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
        ];
    }

    public function verifyPayment(array $data): bool
    {
        try {
            $intent = PaymentIntent::retrieve($data['gateway_payment_id']);

            return $intent->status === 'succeeded';
        } catch (\Exception $e) {
            return false;
        }
    }

    public function verifyWebhook(array $payload): bool
    {
        $sigHeader = request()->header('Stripe-Signature');
        try {
            Webhook::constructEvent(request()->getContent(), $sigHeader, $this->webhookSecret);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function handleWebhook(array $payload): ?array
    {
        $type = $payload['type'] ?? '';
        if ($type === 'payment_intent.succeeded' || $type === 'payment_intent.payment_failed') {
            $paymentId = $payload['data']['object']['metadata']['payment_id'] ?? null;
            if ($paymentId) {
                return [
                    'payment_id' => $paymentId,
                    'status' => $type === 'payment_intent.succeeded' ? 'successful' : 'failed',
                ];
            }
        }

        return null;
    }
}
