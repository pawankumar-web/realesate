<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vendor_id' => User::factory()->vendor(),
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'name' => fake()->name(),
            'email' => fake()->email(),
            'phone' => fake()->phoneNumber(),
            'message' => fake()->sentence(),
            'status' => 'new',
            'source' => fake()->randomElement(['website', 'whatsapp', 'referral']),
        ];
    }
}
