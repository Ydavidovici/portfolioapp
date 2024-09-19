<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Http\Requests\FeedbackRequest;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedback = Feedback::with('project', 'submittedBy')->get();
        return response()->json($feedback);
    }

    public function store(FeedbackRequest $request)
    {
        $feedback = Feedback::create($request->validated());

        return response()->json([
            'message' => 'Feedback submitted successfully.',
            'feedback' => $feedback,
        ], 201);
    }

    public function show(Feedback $feedback)
    {
        return response()->json($feedback->load('project', 'submittedBy'));
    }

    public function update(FeedbackRequest $request, Feedback $feedback)
    {
        $feedback->update($request->validated());

        return response()->json([
            'message' => 'Feedback updated successfully.',
            'feedback' => $feedback,
        ]);
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully.',
        ]);
    }
}
