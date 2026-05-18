<?php

namespace Tests\Feature\Api;

use App\Models\Lead;
use App\Models\Property;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_can_view_analytics(): void
    {
        $vendor = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $vendor->id]);
        $token = $vendor->createToken('test')->plainTextToken;

        Property::factory(3)->create(['user_id' => $vendor->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/vendor/analytics');

        $response->assertStatus(200)
            ->assertJsonPath('data.total_properties', 3);
    }

    public function test_vendor_can_view_leads(): void
    {
        $vendor = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $vendor->id]);
        $token = $vendor->createToken('test')->plainTextToken;

        Lead::factory(3)->create(['vendor_id' => $vendor->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/vendor/leads');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_vendor_can_update_kyc(): void
    {
        $vendor = User::factory()->vendor()->create();
        $token = $vendor->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/v1/vendor/kyc', [
                'company_name' => 'My Realty Co.',
                'gst_no' => 'GSTIN1234567890',
                'pan_no' => 'ABCDE1234F',
                'business_address' => '123 Business Park, Mumbai',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.kyc_status', 'pending');
    }

    public function test_vendor_can_list_own_properties(): void
    {
        $vendor = User::factory()->vendor()->create();
        Vendor::factory()->create(['user_id' => $vendor->id]);
        $token = $vendor->createToken('test')->plainTextToken;

        Property::factory(2)->create(['user_id' => $vendor->id]);
        Property::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/vendor/properties');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_user_cannot_access_vendor_routes(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/vendor/analytics');

        $response->assertStatus(403);
    }
}
