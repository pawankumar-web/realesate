<?php

namespace Tests\Feature\Api;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_dashboard(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        Property::factory(3)->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data' => ['total_users', 'total_properties']]);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        User::factory(3)->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200);
        $this->assertCount(4, $response->json('data')); // 3 + admin
    }

    public function test_admin_can_approve_property(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $property = Property::factory()->pending()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/v1/admin/properties/{$property->id}/approve");

        $response->assertStatus(200);
        $this->assertEquals('approved', $property->fresh()->status);
    }

    public function test_admin_can_reject_property(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $property = Property::factory()->pending()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/v1/admin/properties/{$property->id}/reject");

        $response->assertStatus(200);
        $this->assertEquals('rejected', $property->fresh()->status);
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $user = User::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/v1/admin/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }
}
