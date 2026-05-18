<?php

namespace Tests\Feature\Api;

use App\Models\Booking;
use App\Models\Property;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_toggle_bookmark(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/v1/user/bookmarks/{$property->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.is_bookmarked', true);
    }

    public function test_user_can_list_bookmarks(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();
        $user->bookmarks()->attach($property);

        $token = $user->createToken('test')->plainTextToken;
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/user/bookmarks');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_user_can_submit_review(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/v1/user/reviews/{$property->id}", [
                'rating' => 5,
                'review' => 'Excellent property!',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.rating', 5);
    }

    public function test_user_cannot_submit_duplicate_review(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        Review::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'rating' => 4,
            'status' => 'approved',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/v1/user/reviews/{$property->id}", [
                'rating' => 5,
                'review' => 'Another review',
            ]);

        $response->assertStatus(409);
    }

    public function test_user_can_schedule_booking(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/v1/user/bookings/{$property->id}", [
                'visit_date' => now()->addDays(3)->format('Y-m-d'),
                'visit_time' => '10:00',
                'notes' => 'Looking forward to visiting',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'data' => ['id', 'visit_date', 'visit_time']]);
    }

    public function test_user_can_list_bookings(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        Booking::factory(2)->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/user/bookings');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }
}
