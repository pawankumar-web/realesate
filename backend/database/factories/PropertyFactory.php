<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PropertyFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->streetName().' '.fake()->randomElement(['Apartment', 'Villa', 'House', 'Condo']);

        return [
            'user_id' => User::factory()->vendor(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(6),
            'description' => fake()->paragraphs(3, true),
            'price' => fake()->randomFloat(2, 50000, 5000000),
            'discount_price' => fake()->optional(0.3)->randomFloat(2, 45000, 4500000),
            'purpose' => fake()->randomElement(['buy', 'rent']),
            'property_type' => fake()->randomElement(['apartment', 'villa', 'house', 'commercial', 'land']),
            'bhk' => fake()->randomElement(['1 BHK', '2 BHK', '3 BHK', '4 BHK']),
            'area_sqft' => fake()->randomFloat(2, 500, 10000),
            'bedrooms' => fake()->numberBetween(1, 5),
            'bathrooms' => fake()->numberBetween(1, 4),
            'furnished_status' => fake()->randomElement(['full', 'semi', 'unfurnished']),
            'property_age' => fake()->numberBetween(0, 30),
            'ownership_type' => fake()->randomElement(['freehold', 'leasehold', 'cooperative']),
            'parking' => fake()->boolean(),
            'balcony' => fake()->boolean(),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'zip_code' => fake()->postcode(),
            'lat' => fake()->latitude(),
            'lng' => fake()->longitude(),
            'status' => 'approved',
            'is_featured' => false,
            'is_verified' => true,
            'views' => fake()->numberBetween(0, 1000),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending', 'is_verified' => false]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => ['is_featured' => true]);
    }
}
