<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuickbooksTokenRequest;
use App\Models\QuickBooksToken;
use Illuminate\Support\Facades\Gate;

class QuickBooksTokenController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        // Only Admins can view all tokens
        Gate::authorize('manage-users/roles');

        $tokens = QuickBooksToken::all();

        return response()->json($tokens);
    }

    public function store(QuickbooksTokenRequest $request)
    {
        // Only Admins can create tokens
        Gate::authorize('manage-users/roles');

        $data = $request->validated();

        // Calculate expires_at if not provided
        if (empty($data['expires_at']) && !empty($data['expires_in'])) {
            $data['expires_at'] = now()->addSeconds($data['expires_in']);
        }

        $token = QuickBooksToken::create($data);

        return response()->json([
            'message' => 'QuickBooks token created successfully.',
            'token' => $token,
        ], 201);
    }

    public function show(QuickBooksToken $quickbooksToken)
    {
        // Only Admins can view the token
        Gate::authorize('manage-users/roles');

        return response()->json($quickbooksToken);
    }

    public function update(QuickbooksTokenRequest $request, QuickBooksToken $quickbooksToken)
    {
        // Only Admins can update tokens
        Gate::authorize('manage-users/roles');

        $data = $request->validated();

        // Calculate expires_at if not provided
        if (empty($data['expires_at']) && !empty($data['expires_in'])) {
            $data['expires_at'] = now()->addSeconds($data['expires_in']);
        }

        $quickbooksToken->update($data);

        return response()->json([
            'message' => 'QuickBooks token updated successfully.',
            'token' => $quickbooksToken,
        ]);
    }

    public function destroy(QuickBooksToken $quickbooksToken)
    {
        // Only Admins can delete tokens
        Gate::authorize('manage-users/roles');

        $quickbooksToken->delete();

        return response()->json([
            'message' => 'QuickBooks token deleted successfully.',
        ]);
    }
}
