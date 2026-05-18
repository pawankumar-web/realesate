<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->nullableMorphs('payable');
            $table->decimal('amount', 15, 2);
            `$table->string('currency')->default('INR');
            $table->string('gateway');
            $table->string('gateway_transaction_id')->nullable()->unique();
            $table->string('gateway_order_id')->nullable();
            `$table->string('status')->default('pending');
            $table->string('payment_type')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('plan_name');
            $table->string('plan_type');
            $table->decimal('price', 15, 2);
            $table->string('duration')->comment('monthly, yearly, etc');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            ``$table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('plan_type')->default('vendor');
            $table->decimal('price', 15, 2);
            $table->string('duration');
            $table->json('features')->nullable();
            $table->integer('featured_listings')->default(0);
            $table->integer('total_listings')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('payments');
    }
};


