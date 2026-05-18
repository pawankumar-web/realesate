<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyImageController extends Controller
{
    use ApiResponse;

    public function store(Request $request, Property $property): JsonResponse
    {
        $request->validate([
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $uploaded = [];
        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('properties', 'public');
            $image = PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $path,
                'is_primary' => $index === 0 && ! $property->images()->where('is_primary', true)->exists(),
                'sort_order' => $index,
            ]);
            $uploaded[] = $image;
        }

        return $this->success($uploaded, 'Images uploaded successfully', 201);
    }

    public function destroy(Property $property, PropertyImage $image): JsonResponse
    {
        if ($image->property_id !== $property->id) {
            return $this->error('Image not found', 404);
        }
        \Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return $this->success(null, 'Image deleted successfully');
    }
}
