<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\RazorpayService;
use App\Services\StripeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly RazorpayService $razorpay,
        private readonly StripeService $stripe,
    ) {}

    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'gateway' => 'required|in:razorpay,stripe',
            'amount' => 'required|numeric|min:1',
            'payment_type' => 'required|string',
            'payable_type' => 'nullable|string',
            'payable_id' => 'nullable|integer',
        ]);

        $gateway = $validated['gateway'];
        $amount = $validated['amount'];

        $payment = Payment::create([
            'user_id' => auth()->id(),
            'amount' => $amount,
            'currency' => env('CURRENCY', 'INR'),
            'gateway' => $gateway,
            'payment_type' => $validated['payment_type'],
            'status' => 'pending',
        ]);

        $orderData = $gateway === 'razorpay'
            ? $this->razorpay->createOrder($payment)
            : $this->stripe->createPaymentIntent($payment);

        return $this->success(array_merge($orderData, ['payment_id' => $payment->id]));
    }

    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'gateway' => 'required|in:razorpay,stripe',
            'payment_id' => 'required|exists:payments,id',
            'gateway_payment_id' => 'required|string',
            'gateway_order_id' => 'nullable|string',
            'signature' => 'required_if:gateway,razorpay|string',
        ]);

        $payment = Payment::findOrFail($validated['payment_id']);

        $verified = $validated['gateway'] === 'razorpay'
            ? $this->razorpay->verifyPayment($validated)
            : $this->stripe->verifyPayment($validated);

        if (! $verified) {
            $payment->update(['status' => 'failed']);

            return $this->error('Payment verification failed', 400);
        }

        $payment->update([
            'status' => 'successful',
            'gateway_transaction_id' => $validated['gateway_payment_id'],
            'gateway_order_id' => $validated['gateway_order_id'] ?? null,
        ]);

        $this->handlePostPayment($payment);

        return $this->success($payment, 'Payment successful');
    }

    public function webhook(Request $request, string $gateway): JsonResponse
    {
        $payload = $request->all();
        $verified = $gateway === 'razorpay'
            ? $this->razorpay->verifyWebhook($payload)
            : $this->stripe->verifyWebhook($payload);

        if (! $verified) {
            return $this->error('Invalid webhook', 400);
        }

        $event = $gateway === 'razorpay'
            ? $this->razorpay->handleWebhook($payload)
            : $this->stripe->handleWebhook($payload);

        if ($event && ($payment = Payment::find($event['payment_id']))) {
            $payment->update(['status' => $event['status']]);
            $this->handlePostPayment($payment);
        }

        return $this->success(null, 'Webhook processed');
    }

    public function history(): JsonResponse
    {
        $payments = Payment::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);

        return $this->paginated($payments);
    }

    private function handlePostPayment(Payment $payment): void
    {
        if ($payment->status !== 'successful') {
            return;
        }

        if ($payment->payment_type === 'subscription' && $payment->payable_type === SubscriptionPlan::class) {
            $plan = SubscriptionPlan::find($payment->payable_id);
            if ($plan) {
                Subscription::create([
                    'user_id' => $payment->user_id,
                    'plan_name' => $plan->name,
                    'plan_type' => $plan->plan_type,
                    'price' => $plan->price,
                    'duration' => $plan->duration,
                    'starts_at' => now(),
                    'ends_at' => $plan->duration === 'monthly' ? now()->addMonth() : now()->addYear(),
                    'status' => 'active',
                ]);
            }
        }
    }
}
