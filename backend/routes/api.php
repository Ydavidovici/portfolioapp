<?php

use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Client\ClientDashboardController;
use App\Http\Controllers\Developer\DeveloperDashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Protected routes with default rate limiting
Route::middleware(['auth:sanctum', 'verified', 'throttle:api'])->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Change Password
    Route::post('/password/change', [AuthController::class, 'changePassword']);

    // Client Dashboard Routes
    Route::middleware('role:client')->group(function () {
        Route::get('/client/dashboard', [ClientDashboardController::class, 'index']);
        // Client-specific CRUD routes
    });

    // Developer Dashboard Routes
    Route::middleware('role:developer')->group(function () {
        Route::get('/developer/dashboard', [DeveloperDashboardController::class, 'index']);
        // Developer-specific CRUD routes
    });

    // Admin Dashboard and CRUD Routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
        // Admin-specific CRUD routes
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('tasks', TaskController::class);
        // Add other resources as needed
    });

    // Routes accessible by multiple roles
    Route::middleware('role:admin,developer')->group(function () {
        // Shared routes between admin and developer
    });
});

// Email Verification Routes
Route::middleware(['auth:sanctum', 'throttle:6,1'])->group(function () {
    // Verify Email
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->name('verification.verify')
        ->middleware('signed');

    // Resend Verification Email
    Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])
        ->name('verification.resend');
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/latest', [MessageController::class, 'latest']);
});

