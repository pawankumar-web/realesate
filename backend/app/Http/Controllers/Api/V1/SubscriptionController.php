<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    use ApiResponse;

    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);

        if ($plan->price > 0) {
            return $this->error('This plan requires payment. Use the payment endpoint.', 400);
        }

        $subscription = Subscription::create([
            'user_id' => auth()->id(),
            'plan_name' => $plan->name,
            'plan_type' => $plan->plan_type,
            'price' => $plan->price,
            'duration' => $plan->duration,
            'starts_at' => now(),
            'ends_at' => $plan->duration === 'monthly' ? now()->addMonth() : now()->addYear(),
            'status' => 'active',
        ]);

        return $this->success($subscription, 'Subscribed successfully', 201);
    }

    public function my(): JsonResponse
    {
        $subscriptions = Subscription::where('user_id', auth()->id())
            ->latest()
            ->get();

        return $this->success($subscriptions);
    }
}
