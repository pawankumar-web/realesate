<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionPlanController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(SubscriptionPlan::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:subscription_plans',
            'plan_type' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|string',
            'features' => 'nullable|array',
            'total_listings' => 'nullable|integer',
            'featured_listings' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $plan = SubscriptionPlan::create($validated);

        return $this->success($plan, 'Plan created', 201);
    }

    public function update(Request $request, SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $subscriptionPlan->update($request->all());

        return $this->success($subscriptionPlan, 'Plan updated');
    }

    public function destroy(SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $subscriptionPlan->delete();

        return $this->success(null, 'Plan deleted');
    }
}
