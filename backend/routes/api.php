<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
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
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\QuickBooksTokenController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskListController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

// Public Routes: Registration, Login, Password Reset
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset Routes
Route::post('/password/email', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

// Email Verification Routes
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify')
    ->middleware(['signed', 'throttle:6,1']);

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])
    ->name('verification.resend')
    ->middleware(['auth:api', 'throttle:6,1']); // Changed from 'auth:sanctum' to 'auth:api'

// Protected Routes: Require Authentication
Route::middleware(['auth:api', 'throttle:api'])->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Change Password
    Route::post('/password/change', [AuthController::class, 'changePassword']);

    // Client Dashboard Routes
    Route::get('/client/dashboard', [ClientDashboardController::class, 'index']);

    // Developer Dashboard Routes
    Route::get('/developer/dashboard', [DeveloperDashboardController::class, 'index']);

    // Admin Dashboard and CRUD Routes
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class); // Admin manages roles

    // Routes accessible by multiple roles (admin and developer)
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
    Route::apiResource('tasklists', TaskListController::class);

    // Messages Routes
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/latest', [MessageController::class, 'latest']);
});
