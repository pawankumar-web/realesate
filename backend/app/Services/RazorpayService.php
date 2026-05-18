<?php

namespace App\Services;

use App\Models\Payment;

class RazorpayService
{
    private string $key;

    private string $secret;

    public function __construct()
    {
        $this->key = config('services.razorpay.key');
        $this->secret = config('services.razorpay.secret');
    }

    public function createOrder(Payment $payment): array
    {
        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_USERPWD => "{$this->key}:{$this->secret}",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'amount' => (int) ($payment->amount * 100),
                'currency' => $payment->currency,
                'receipt' => (string) $payment->id,
                'notes' => ['payment_type' => $payment->payment_type],
            ]),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $payment->update(['gateway_order_id' => $response['id'] ?? null]);

        return [
            'order_id' => $response['id'] ?? null,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'key' => $this->key,
        ];
    }

    public function verifyPayment(array $data): bool
    {
        $expected = hash_hmac('sha256', "{$data['gateway_order_id']}|{$data['gateway_payment_id']}", $this->secret);

        return hash_equals($expected, $data['signature']);
    }

    public function verifyWebhook(array $payload): bool
    {
        $signature = request()->header('X-Razorpay-Signature');
        $expected = hash_hmac('sha256', request()->getContent(), $this->secret);

        return hash_equals($expected, $signature);
    }

    public function handleWebhook(array $payload): ?array
    {
        $event = $payload['event'] ?? '';
        if ($event === 'payment.captured' || $event === 'payment.failed') {
            $paymentId = $payload['payload']['payment']['entity']['notes']['payment_id'] ?? null;
            if ($paymentId) {
                return [
                    'payment_id' => $paymentId,
                    'status' => $event === 'payment.captured' ? 'successful' : 'failed',
                ];
            }
        }

        return null;
    }
}
