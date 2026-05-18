<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'discount_price' => (float) $this->discount_price,
            'purpose' => $this->purpose,
            'property_type' => $this->property_type,
            'bhk' => $this->bhk,
            'area_sqft' => (float) $this->area_sqft,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'furnished_status' => $this->furnished_status,
            'property_age' => $this->property_age,
            'ownership_type' => $this->ownership_type,
            'floors' => $this->floors,
            'parking' => $this->parking,
            'balcony' => $this->balcony,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'lat' => (float) $this->lat,
            'lng' => (float) $this->lng,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'is_verified' => $this->is_verified,
            'views' => $this->views,
            'images' => PropertyImageResource::collection($this->whenLoaded('images')),
            'amenities' => $this->whenLoaded('amenities'),
            'user' => new UserResource($this->whenLoaded('user')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
