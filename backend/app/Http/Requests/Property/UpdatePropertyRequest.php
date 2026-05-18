<?php

namespace App\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && (
            $this->user()->isAdmin() ||
            $this->user()->id === $this->route('property')->user_id
        );
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'purpose' => 'sometimes|in:buy,rent',
            'property_type' => 'sometimes|string|max:100',
            'bhk' => 'nullable|string|max:10',
            'area_sqft' => 'sometimes|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'furnished_status' => 'nullable|string|max:50',
            'property_age' => 'nullable|integer|min:0',
            'ownership_type' => 'nullable|string|max:50',
            'floors' => 'nullable|integer|min:0',
            'parking' => 'nullable|boolean',
            'balcony' => 'nullable|boolean',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'state' => 'sometimes|string|max:100',
            'zip_code' => 'sometimes|string|max:20',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',
        ];
    }
}
