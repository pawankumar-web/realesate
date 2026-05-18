<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@realesate.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'status' => 'active',
        ]);

        $vendor = User::create([
            'name' => 'Demo Agent',
            'email' => 'agent@realesate.com',
            'phone' => '9876543210',
            'password' => Hash::make('password'),
            'role' => 'vendor',
            'email_verified_at' => now(),
            'status' => 'active',
        ]);

        Vendor::create([
            'user_id' => $vendor->id,
            'company_name' => 'Demo Realty',
            'kyc_status' => 'approved',
            'is_verified' => true,
            'commission_rate' => 2.5,
            'approved_at' => now(),
        ]);

        User::create([
            'name' => 'John Buyer',
            'email' => 'user@realesate.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
    }
}
