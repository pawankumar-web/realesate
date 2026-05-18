<?php

namespace App\Services;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class PropertyService
{
    public function list(array $filters): LengthAwarePaginator
    {
        $query = Property::with(['images', 'amenities', 'user'])
            ->where('status', 'approved');

        $query = $this->applyFilters($query, $filters);

        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $perPage = $filters['per_page'] ?? 12;

        return $query->orderBy($sortField, $sortOrder)->paginate($perPage);
    }

    private function applyFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }
        if (! empty($filters['state'])) {
            $query->where('state', $filters['state']);
        }
        if (! empty($filters['pincode'])) {
            $query->where('zip_code', $filters['pincode']);
        }
        if (! empty($filters['purpose'])) {
            $query->where('purpose', $filters['purpose']);
        }
        if (! empty($filters['property_type'])) {
            $query->where('property_type', $filters['property_type']);
        }
        if (! empty($filters['bhk'])) {
            $query->where('bhk', $filters['bhk']);
        }
        if (! empty($filters['bedrooms'])) {
            $query->where('bedrooms', '>=', (int) $filters['bedrooms']);
        }
        if (! empty($filters['bathrooms'])) {
            $query->where('bathrooms', '>=', (int) $filters['bathrooms']);
        }
        if (! empty($filters['min_price'])) {
            $query->where('price', '>=', (float) $filters['min_price']);
        }
        if (! empty($filters['max_price'])) {
            $query->where('price', '<=', (float) $filters['max_price']);
        }
        if (! empty($filters['min_area'])) {
            $query->where('area_sqft', '>=', (float) $filters['min_area']);
        }
        if (! empty($filters['max_area'])) {
            $query->where('area_sqft', '<=', (float) $filters['max_area']);
        }
        if (! empty($filters['furnished_status'])) {
            $query->where('furnished_status', $filters['furnished_status']);
        }
        if (! empty($filters['amenities'])) {
            $amenities = is_array($filters['amenities']) ? $filters['amenities'] : explode(',', $filters['amenities']);
            $query->whereHas('amenities', function ($q) use ($amenities) {
                $q->whereIn('amenities.id', $amenities);
            }, '=', count($amenities));
        }
        if (! empty($filters['is_featured'])) {
            $query->where('is_featured', true);
        }
        if (! empty($filters['is_verified'])) {
            $query->where('is_verified', true);
        }
        if (! empty($filters['ready_to_move'])) {
            $query->where('property_age', '<=', 1);
        }

        return $query;
    }

    public function create(User $user, array $data): Property
    {
        $data['user_id'] = $user->id;
        $data['status'] = $user->isAdmin() ? 'approved' : 'pending';

        $property = Property::create($data);

        if (! empty($data['amenities'])) {
            $property->amenities()->sync($data['amenities']);
        }

        return $property->load(['images', 'amenities']);
    }

    public function update(Property $property, array $data): Property
    {
        $property->update($data);

        if (isset($data['amenities'])) {
            $property->amenities()->sync($data['amenities']);
        }

        return $property->fresh(['images', 'amenities']);
    }
}
