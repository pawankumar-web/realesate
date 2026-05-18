<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class BookmarkController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $properties = auth()->user()->bookmarks()->with(['images', 'amenities'])->paginate(12);

        return $this->paginated($properties);
    }

    public function toggle(Property $property): JsonResponse
    {
        $user = auth()->user();
        $bookmarked = $user->bookmarks()->toggle($property->id);
        $isBookmarked = count($bookmarked['attached']) > 0;

        return $this->success([
            'is_bookmarked' => $isBookmarked,
            'property_id' => $property->id,
        ], $isBookmarked ? 'Added to wishlist' : 'Removed from wishlist');
    }
}
