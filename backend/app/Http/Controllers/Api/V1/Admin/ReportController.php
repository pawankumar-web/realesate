<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $period = $request->get('period', 'monthly');

        $data = [
            'users_by_role' => User::selectRaw('role, count(*) as total')
                ->groupBy('role')->get(),
            'properties_by_status' => Property::selectRaw('status, count(*) as total')
                ->groupBy('status')->get(),
            'properties_by_purpose' => Property::selectRaw('purpose, count(*) as total')
                ->groupBy('purpose')->get(),
            'revenue' => Payment::where('status', 'successful')
                ->selectRaw('SUM(amount) as total, COUNT(*) as count')
                ->first(),
            'recent_payments' => Payment::with('user')
                ->latest()->take(20)->get(),
        ];

        return $this->success($data);
    }
}
