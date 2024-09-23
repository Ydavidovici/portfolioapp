<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuickbooksTokenRequest;
use App\Models\QuickBooksToken;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class QuickBooksTokenController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * Apply authentication middleware to all routes in this controller.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the QuickBooks tokens.
     *
     * Only Admins can view all tokens.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Only Admins can view all tokens
        if (!Gate::allows('manage-users/roles')) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $tokens = QuickBooksToken::all();

        return response()->json($tokens);
    }

    /**
     * Store a newly created QuickBooks token in storage.
     *
     * Only Admins can create tokens.
     *
     * @param  \App\Http\Requests\QuickbooksTokenRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(QuickbooksTokenRequest $request)
    {
        // Only Admins can create tokens
        Gate::authorize('manage-users/roles');

        $token = QuickBooksToken::create($request->validated());

        return response()->json([
            'message' => 'QuickBooks token created successfully.',
            'token' => $token,
        ], 201);
    }

    /**
     * Display the specified QuickBooks token.
     *
     * Only Admins can view any token.
     *
     * @param  \App\Models\QuickBooksToken  $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(QuickBooksToken $token)
    {
        // Only Admins can view the token
        if (!Gate::allows('manage-users/roles')) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json($token);
    }

    /**
     * Update the specified QuickBooks token in storage.
     *
     * Only Admins can update tokens.
     *
     * @param  \App\Http\Requests\QuickbooksTokenRequest  $request
     * @param  \App\Models\QuickBooksToken  $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(QuickbooksTokenRequest $request, QuickBooksToken $token)
    {
        // Only Admins can update tokens
        Gate::authorize('manage-users/roles');

        $token->update($request->validated());

        return response()->json([
            'message' => 'QuickBooks token updated successfully.',
            'token' => $token,
        ]);
    }

    /**
     * Remove the specified QuickBooks token from storage.
     *
     * Only Admins can delete tokens.
     *
     * @param  \App\Models\QuickBooksToken  $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(QuickBooksToken $token)
    {
        // Only Admins can delete tokens
        Gate::authorize('manage-users/roles');

        $token->delete();

        return response()->json([
            'message' => 'QuickBooks token deleted successfully.',
        ]);
    }
}
