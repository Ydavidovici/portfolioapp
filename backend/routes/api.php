<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\CalendarEntryController;
use App\Http\Controllers\ChecklistController;
use App\Http\Controllers\ChecklistItemController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\QuickBooksTokenController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\UserController;
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
        Route::apiResource('users', UserController::class);
    });

    // Routes accessible by multiple roles
    Route::middleware('role:admin,developer')->group(function () {
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('tasks', TaskController::class);
        Route::apiResource('boards', BoardController::class);
        Route::apiResource('calendar-entries', CalendarEntryController::class);
        Route::apiResource('checklists', ChecklistController::class);
        Route::apiResource('checklist-items', ChecklistItemController::class);
        Route::apiResource('documents', DocumentController::class);
        Route::apiResource('invoices', InvoiceController::class);
        Route::apiResource('feedback', FeedbackController::class);
        Route::apiResource('notes', NoteController::class);
        Route::apiResource('payments', PaymentController::class);
        Route::apiResource('quickbooks-tokens', QuickBooksTokenController::class);
        Route::apiResource('reminders', ReminderController::class);
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('tasklists', TaskListController::class);
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

