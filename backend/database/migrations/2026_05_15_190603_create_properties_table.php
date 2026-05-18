<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 15, 2);
            $table->decimal('discount_price', 15, 2)->nullable();
            $table->string('purpose');
            $table->string('property_type');
            $table->string('bhk')->nullable();
            $table->decimal('area_sqft', 10, 2);
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->string('furnished_status')->nullable();
            $table->integer('property_age')->nullable();
            $table->string('ownership_type')->nullable();
            $table->integer('floors')->nullable();
            $table->boolean('parking')->default(false);
            $table->boolean('balcony')->default(false);
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->string('status')->default('pending');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->bigInteger('views')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('nearby_places')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['city', 'state', 'status', 'purpose']);
            $table->index(['price', 'area_sqft', 'bedrooms']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};


