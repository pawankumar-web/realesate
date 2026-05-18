<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PropertyManagementController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $properties = Property::with(['user', 'images'])
            ->latest()
            ->paginate(20);

        return $this->paginated($properties);
    }

    public function show(Property $property): JsonResponse
    {
        return $this->success($property->load(['user', 'images', 'amenities', 'reviews.user']));
    }

    public function destroy(Property $property): JsonResponse
    {
        $property->delete();

        return $this->success(null, 'Property deleted successfully');
    }
}
