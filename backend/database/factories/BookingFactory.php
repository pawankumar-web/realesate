<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'visit_date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'visit_time' => fake()->randomElement(['10:00', '11:00', '14:00', '15:00', '16:00']),
            'status' => 'pending',
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
