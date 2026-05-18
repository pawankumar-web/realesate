<?php

namespace App\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && in_array($this->user()->role, ['vendor', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'purpose' => 'required|in:buy,rent',
            'property_type' => 'required|string|max:100',
            'bhk' => 'nullable|string|max:10',
            'area_sqft' => 'required|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'furnished_status' => 'nullable|string|max:50',
            'property_age' => 'nullable|integer|min:0',
            'ownership_type' => 'nullable|string|max:50',
            'floors' => 'nullable|integer|min:0',
            'parking' => 'nullable|boolean',
            'balcony' => 'nullable|boolean',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip_code' => 'required|string|max:20',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',
            'nearby_places' => 'nullable|array',
        ];
    }
}
