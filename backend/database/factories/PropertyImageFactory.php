<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'image_path' => 'properties/'.fake()->uuid().'.jpg',
            'is_primary' => false,
            'sort_order' => 0,
        ];
    }
}
