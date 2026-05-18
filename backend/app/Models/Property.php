<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'title', 'slug', 'description', 'price', 'discount_price',
        'purpose', 'property_type', 'bhk', 'area_sqft', 'bedrooms', 'bathrooms',
        'furnished_status', 'property_age', 'ownership_type', 'floors', 'parking',
        'balcony', 'address', 'city', 'state', 'zip_code', 'lat', 'lng',
        'status', 'is_featured', 'is_verified', 'views', 'meta_title',
        'meta_description', 'nearby_places',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_price' => 'decimal:2',
            'area_sqft' => 'decimal:2',
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
            'is_featured' => 'boolean',
            'is_verified' => 'boolean',
            'parking' => 'boolean',
            'balcony' => 'boolean',
            'nearby_places' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Property $property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->title).'-'.Str::random(6);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(PropertyImage::class)->where('is_primary', true);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'property_amenity');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }
}
