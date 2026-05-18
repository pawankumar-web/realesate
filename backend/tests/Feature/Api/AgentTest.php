<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_verified_agents(): void
    {
        $agent1 = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $agent1->id, 'is_verified' => true]);

        $agent2 = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $agent2->id, 'is_verified' => true]);

        $unverified = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $unverified->id, 'is_verified' => false]);

        $response = $this->getJson('/api/v1/agents');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_show_agent_detail(): void
    {
        $agent = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $agent->id, 'is_verified' => true]);

        $response = $this->getJson("/api/v1/agents/{$agent->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $agent->id);
    }

    public function test_returns_404_for_nonexistent_agent(): void
    {
        $response = $this->getJson('/api/v1/agents/999');
        $response->assertStatus(404);
    }
}
