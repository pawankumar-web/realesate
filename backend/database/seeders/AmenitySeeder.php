<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            ['name' => 'Swimming Pool', 'category' => 'Recreation'],
            ['name' => 'Gym', 'category' => 'Recreation'],
            ['name' => 'Park', 'category' => 'Outdoor'],
            ['name' => 'Club House', 'category' => 'Recreation'],
            ['name' => 'Play Area', 'category' => 'Outdoor'],
            ['name' => 'Security', 'category' => 'Safety'],
            ['name' => 'CCTV', 'category' => 'Safety'],
            ['name' => 'Lift', 'category' => 'Building'],
            ['name' => 'Parking', 'category' => 'Building'],
            ['name' => 'Power Backup', 'category' => 'Building'],
            ['name' => 'Water Supply', 'category' => 'Utility'],
            ['name' => 'Gas Pipeline', 'category' => 'Utility'],
            ['name' => 'Rain Water Harvesting', 'category' => 'Eco'],
            ['name' => 'Jogging Track', 'category' => 'Outdoor'],
            ['name' => 'Tennis Court', 'category' => 'Sports'],
            ['name' => 'Indoor Games', 'category' => 'Sports'],
            ['name' => 'Intercom', 'category' => 'Building'],
            ['name' => 'Visitor Parking', 'category' => 'Building'],
            ['name' => 'Wheelchair Accessible', 'category' => 'Building'],
            ['name' => 'Pet Friendly', 'category' => 'Building'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }
    }
}
