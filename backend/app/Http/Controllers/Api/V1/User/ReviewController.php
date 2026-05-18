<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    public function store(Request $request, Property $property): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        $existing = Review::where('user_id', auth()->id())
            ->where('property_id', $property->id)
            ->first();

        if ($existing) {
            return $this->error('You have already reviewed this property', 409);
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'property_id' => $property->id,
            'rating' => $validated['rating'],
            'review' => $validated['review'] ?? null,
            'status' => 'pending',
        ]);

        return $this->success($review->load('user'), 'Review submitted successfully', 201);
    }
}
