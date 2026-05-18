<?php

use App\Http\Controllers\Api\V1\Admin\BackupController;
use App\Http\Controllers\Api\V1\Admin\BannerController;
use App\Http\Controllers\Api\V1\Admin\BlogManagementController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\PropertyManagementController;
use App\Http\Controllers\Api\V1\Admin\PropertyModerationController;
use App\Http\Controllers\Api\V1\Admin\ReportController;
use App\Http\Controllers\Api\V1\Admin\UserManagementController;
use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\AmenityController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\ChatController;
use App\Http\Controllers\Api\V1\CmsController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PropertyController;
use App\Http\Controllers\Api\V1\PropertyImageController;
use App\Http\Controllers\Api\V1\SubscriptionController;
use App\Http\Controllers\Api\V1\SubscriptionPlanController;
use App\Http\Controllers\Api\V1\User\BookingController;
use App\Http\Controllers\Api\V1\User\BookmarkController;
use App\Http\Controllers\Api\V1\User\ReviewController;
use App\Http\Controllers\Api\V1\Vendor\AnalyticsController;
use App\Http\Controllers\Api\V1\Vendor\KycController;
use App\Http\Controllers\Api\V1\Vendor\LeadController;
use App\Http\Controllers\Api\V1\Vendor\VendorPropertyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public auth
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    // Public listings
    Route::get('properties', [PropertyController::class, 'index']);
    Route::get('properties/featured', [PropertyController::class, 'featured']);
    Route::get('properties/trending', [PropertyController::class, 'trending']);
    Route::get('properties/nearby', [PropertyController::class, 'nearby']);
    Route::get('properties/{slug}', [PropertyController::class, 'show']);
    Route::get('agents', [AgentController::class, 'index']);
    Route::get('agents/{id}', [AgentController::class, 'show']);
    Route::get('amenities', [AmenityController::class, 'index']);
    Route::get('blogs', [BlogController::class, 'index']);
    Route::get('blogs/{slug}', [BlogController::class, 'show']);
    Route::get('cms/{slug}', [CmsController::class, 'show']);
    Route::get('subscription-plans', [SubscriptionPlanController::class, 'index']);

    // Payment webhooks (no auth)
    Route::post('payments/webhook/{gateway}', [PaymentController::class, 'webhook']);

    // Authenticated
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('profile', [AuthController::class, 'updateProfile']);
            Route::post('refresh', [AuthController::class, 'refresh']);
        });

        // Chat
        Route::get('chats', [ChatController::class, 'index']);
        Route::get('chats/{conversation}', [ChatController::class, 'show']);
        Route::post('chats', [ChatController::class, 'store']);
        Route::post('chats/{conversation}/read', [ChatController::class, 'markRead']);

        // Payments
        Route::post('payments/create-order', [PaymentController::class, 'createOrder']);
        Route::post('payments/verify', [PaymentController::class, 'verify']);
        Route::get('payments/history', [PaymentController::class, 'history']);

        // Subscriptions
        Route::post('subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
        Route::get('subscriptions/my', [SubscriptionController::class, 'my']);

        // Vendor property mgmt
        Route::middleware('role:vendor,admin')->group(function () {
            Route::post('properties', [PropertyController::class, 'store']);
            Route::put('properties/{property}', [PropertyController::class, 'update']);
            Route::delete('properties/{property}', [PropertyController::class, 'destroy']);
            Route::post('properties/{property}/images', [PropertyImageController::class, 'store']);
            Route::delete('properties/{property}/images/{image}', [PropertyImageController::class, 'destroy']);
        });

        // User features
        Route::middleware('role:user')->prefix('user')->group(function () {
            Route::post('bookmarks/{property}', [BookmarkController::class, 'toggle']);
            Route::get('bookmarks', [BookmarkController::class, 'index']);
            Route::post('reviews/{property}', [ReviewController::class, 'store']);
            Route::post('bookings/{property}', [BookingController::class, 'store']);
            Route::get('bookings', [BookingController::class, 'index']);
        });

        // Vendor dashboard
        Route::middleware('role:vendor')->prefix('vendor')->group(function () {
            Route::get('properties', [VendorPropertyController::class, 'index']);
            Route::get('analytics', [AnalyticsController::class, 'index']);
            Route::get('leads', [LeadController::class, 'index']);
            Route::put('kyc', [KycController::class, 'update']);
        });

        // Admin
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('dashboard', [DashboardController::class, 'index']);
            Route::apiResource('users', UserManagementController::class);
            Route::put('properties/{property}/approve', [PropertyModerationController::class, 'approve']);
            Route::put('properties/{property}/reject', [PropertyModerationController::class, 'reject']);
            Route::apiResource('properties', PropertyManagementController::class);
            Route::apiResource('blogs', BlogManagementController::class);
            Route::apiResource('banners', BannerController::class);
            Route::apiResource('subscription-plans', App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class);
            Route::get('reports', [ReportController::class, 'index']);
            Route::post('backup', [BackupController::class, 'create']);
        });
    });
});
