<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $bookings = Booking::where('user_id', auth()->id())
            ->with(['property.images', 'property.user'])
            ->latest()
            ->paginate(12);

        return $this->paginated($bookings);
    }

    public function store(Request $request, Property $property): JsonResponse
    {
        $validated = $request->validate([
            'visit_date' => 'required|date|after:today',
            'visit_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string|max:500',
        ]);

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'property_id' => $property->id,
            'visit_date' => $validated['visit_date'],
            'visit_time' => $validated['visit_time'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return $this->success($booking, 'Visit scheduled successfully', 201);
    }
}
