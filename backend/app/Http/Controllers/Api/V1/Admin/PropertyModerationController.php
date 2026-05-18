<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PropertyModerationController extends Controller
{
    use ApiResponse;

    public function approve(Property $property): JsonResponse
    {
        $property->update(['status' => 'approved', 'is_verified' => true]);

        return $this->success($property, 'Property approved successfully');
    }

    public function reject(Property $property): JsonResponse
    {
        $property->update(['status' => 'rejected']);

        return $this->success($property, 'Property rejected');
    }
}
