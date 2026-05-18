<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'plan_type' => 'vendor',
                'price' => 0,
                'duration' => 'monthly',
                'features' => ['5 Property Listings', 'Basic Analytics', 'Email Support'],
                'total_listings' => 5,
                'featured_listings' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'plan_type' => 'vendor',
                'price' => 499,
                'duration' => 'monthly',
                'features' => ['25 Property Listings', '2 Featured Listings', 'Advanced Analytics', 'Email & Chat Support'],
                'total_listings' => 25,
                'featured_listings' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'plan_type' => 'vendor',
                'price' => 999,
                'duration' => 'monthly',
                'features' => ['100 Property Listings', '10 Featured Listings', 'Advanced Analytics', 'Priority Support', 'Ad Credits'],
                'total_listings' => 100,
                'featured_listings' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'plan_type' => 'vendor',
                'price' => 2499,
                'duration' => 'monthly',
                'features' => ['Unlimited Listings', '25 Featured Listings', 'Premium Analytics', 'Dedicated Manager', 'API Access'],
                'total_listings' => 0,
                'featured_listings' => 25,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
}
