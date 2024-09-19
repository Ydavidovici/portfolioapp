<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuickbooksTokenRequest;
use App\Models\QuickBooksToken;
use Illuminate\Http\Request;

class QuickBooksTokenController extends Controller
{
    public function index()
    {
        return QuickBooksToken::all();
    }

    public function store(QuickbooksTokenRequest $request)
    {
        $token = QuickBooksToken::create($request->validated());
        return response()->json($token, 201);
    }

    public function show(QuickBooksToken $token)
    {
        return response()->json($token);
    }

    public function update(QuickbooksTokenRequest $request, QuickBooksToken $token)
    {
        $token->update($request->validated());
        return response()->json($token);
    }

    public function destroy(QuickBooksToken $token)
    {
        $token->delete();
        return response()->json(null, 204);
    }
}
