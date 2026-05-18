<?php

namespace Tests\Feature\Api;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_properties(): void
    {
        Property::factory(3)->create();

        $response = $this->getJson('/api/v1/properties');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_filter_properties_by_city(): void
    {
        Property::factory()->create(['city' => 'Mumbai']);
        Property::factory()->create(['city' => 'Delhi']);

        $response = $this->getJson('/api/v1/properties?city=Mumbai');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_properties_by_price_range(): void
    {
        Property::factory()->create(['price' => 500000]);
        Property::factory()->create(['price' => 2000000]);

        $response = $this->getJson('/api/v1/properties?min_price=100000&max_price=1000000');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_properties_by_purpose(): void
    {
        Property::factory()->create(['purpose' => 'buy']);
        Property::factory(2)->create(['purpose' => 'rent']);

        $response = $this->getJson('/api/v1/properties?purpose=rent');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_show_property_detail(): void
    {
        $property = Property::factory()->create();

        $response = $this->getJson("/api/v1/properties/{$property->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $property->id);
    }

    public function test_returns_404_for_nonexistent_property(): void
    {
        $response = $this->getJson('/api/v1/properties/nonexistent-slug');
        $response->assertStatus(404);
    }

    public function test_vendor_can_create_property(): void
    {
        $vendor = User::factory()->vendor()->create();
        $token = $vendor->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/properties', [
                'title' => 'Test Property',
                'description' => 'A beautiful property',
                'price' => 250000,
                'purpose' => 'buy',
                'property_type' => 'apartment',
                'area_sqft' => 1500,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'address' => '123 Main St',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'zip_code' => '400001',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Test Property');
    }

    public function test_user_cannot_create_property(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/properties', [
                'title' => 'Test',
                'description' => 'Test',
                'price' => 100000,
                'purpose' => 'buy',
                'property_type' => 'apartment',
                'area_sqft' => 1000,
                'address' => 'Test',
                'city' => 'Test',
                'state' => 'Test',
                'zip_code' => '123456',
            ]);

        $response->assertStatus(403);
    }

    public function test_can_get_featured_properties(): void
    {
        Property::factory(3)->featured()->create();
        Property::factory(2)->create();

        $response = $this->getJson('/api/v1/properties/featured');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_get_trending_properties(): void
    {
        Property::factory(5)->create();

        $response = $this->getJson('/api/v1/properties/trending');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
    }

    public function test_views_increment_on_detail(): void
    {
        $property = Property::factory()->create(['views' => 0]);

        $this->getJson("/api/v1/properties/{$property->slug}");

        $this->assertEquals(1, $property->fresh()->views);
    }
}
