<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->vendor(),
            'company_name' => fake()->company(),
            'gst_no' => fake()->numerify('GSTIN###########'),
            'pan_no' => strtoupper(fake()->bothify('?????####?')),
            'business_address' => fake()->address(),
            'kyc_status' => 'approved',
            'is_verified' => true,
            'commission_rate' => fake()->randomFloat(2, 1, 5),
            'approved_at' => now(),
        ];
    }
}
