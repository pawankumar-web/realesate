<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AmenityController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $amenities = Amenity::orderBy('category')->orderBy('name')->get();

        return $this->success($amenities);
    }
}
