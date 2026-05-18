<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Property\StorePropertyRequest;
use App\Http\Requests\Property\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\PropertyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PropertyService $propertyService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $properties = $this->propertyService->list($request->all());

        return $this->paginated($properties);
    }

    public function show(string $slug): JsonResponse
    {
        $property = Property::where('slug', $slug)
            ->with(['images', 'amenities', 'user', 'reviews.user'])
            ->firstOrFail();

        $property->increment('views');

        return $this->success(
            new PropertyResource($property),
        );
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $property = $this->propertyService->create($request->user(), $request->validated());

        return $this->success(new PropertyResource($property), 'Property created successfully', 201);
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        $property = $this->propertyService->update($property, $request->validated());

        return $this->success(new PropertyResource($property), 'Property updated successfully');
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->authorize('delete', $property);
        $property->delete();

        return $this->success(null, 'Property deleted successfully');
    }

    public function featured(): JsonResponse
    {
        $properties = Property::where('is_featured', true)
            ->where('status', 'approved')
            ->with(['images', 'amenities', 'user'])
            ->latest()
            ->take(6)
            ->get();

        return $this->success(PropertyResource::collection($properties));
    }

    public function trending(): JsonResponse
    {
        $properties = Property::where('status', 'approved')
            ->with(['images', 'amenities', 'user'])
            ->orderBy('views', 'desc')
            ->take(8)
            ->get();

        return $this->success(PropertyResource::collection($properties));
    }

    public function nearby(Request $request): JsonResponse
    {
        $lat = $request->float('lat');
        $lng = $request->float('lng');
        $radius = $request->float('radius', 5);

        $properties = Property::selectRaw(
            '*, (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance',
            [$lat, $lng, $lat],
        )
            ->having('distance', '<=', $radius)
            ->where('status', 'approved')
            ->orderBy('distance')
            ->get();

        return $this->success(PropertyResource::collection($properties));
    }
}
