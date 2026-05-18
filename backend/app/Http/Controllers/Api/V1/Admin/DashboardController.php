<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $data = [
            'total_users' => User::count(),
            'total_vendors' => User::where('role', 'vendor')->count(),
            'total_properties' => Property::count(),
            'pending_properties' => Property::where('status', 'pending')->count(),
            'total_leads' => Lead::count(),
            'total_revenue' => Payment::where('status', 'successful')->sum('amount'),
            'recent_users' => User::latest()->take(5)->get(),
            'recent_properties' => Property::with('user')->latest()->take(5)->get(),
        ];

        return $this->success($data);
    }
}
