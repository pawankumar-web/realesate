<?php

namespace Tests\Feature\Api;

use App\Models\Amenity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AmenityTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_amenities(): void
    {
        Amenity::factory(5)->create();

        $response = $this->getJson('/api/v1/amenities');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
    }
}
