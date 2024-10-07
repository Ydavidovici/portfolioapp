<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Http\Requests\FeedbackRequest;
use Illuminate\Support\Facades\Gate;

class FeedbackController extends Controller
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
     * Display a listing of the feedback.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('access-admin-dashboard')) {
            // Admins can view all feedback
            $feedback = Feedback::with(['project', 'submittedBy'])->get();
        } elseif (Gate::allows('manage-client-things')) {
            // Clients can view only their own feedback
            $feedback = Feedback::where('submitted_by', $user->id)
                ->with(['project', 'submittedBy'])
                ->get();
        } else {
            // Other roles (if any) cannot view feedback
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json($feedback);
    }

    /**
     * Store a newly created feedback in storage.
     *
     * @param  \App\Http\Requests\FeedbackRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(FeedbackRequest $request)
    {
        $user = auth()->user();

        // Only admins and clients can submit feedback
        if (Gate::allows('access-admin-dashboard') || Gate::allows('manage-client-things')) {
            $feedbackData = $request->validated();
            $feedbackData['submitted_by'] = $user->id; // Set the authenticated user as the submitter

            $feedback = Feedback::create($feedbackData);

            // Load relationships to include in the response
            $feedback->load(['project', 'submittedBy']);

            return response()->json([
                'message' => 'Feedback submitted successfully.',
                'feedback' => $feedback,
            ], 201);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Display the specified feedback.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Feedback $feedback)
    {
        $user = auth()->user();

        if (Gate::allows('access-admin-dashboard') || ($feedback->submitted_by === $user->id && Gate::allows('manage-client-things'))) {
            return response()->json($feedback->load(['project', 'submittedBy']));
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified feedback in storage.
     *
     * @param  \App\Http\Requests\FeedbackRequest  $request
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(FeedbackRequest $request, Feedback $feedback)
    {
        $user = auth()->user();

        // Admins and developers can perform CRUD operations
        // Clients can update their own feedback
        if (Gate::allows('perform-crud-operations') || ($feedback->submitted_by === $user->id && Gate::allows('manage-client-things'))) {
            $feedback->update($request->validated());

            // Reload relationships after update
            $feedback->load(['project', 'submittedBy']);

            return response()->json([
                'message' => 'Feedback updated successfully.',
                'feedback' => $feedback,
            ]);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Remove the specified feedback from storage.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Feedback $feedback)
    {
        $user = auth()->user();

        // Admins and developers can perform CRUD operations
        // Clients can delete their own feedback
        if (Gate::allows('perform-crud-operations') || ($feedback->submitted_by === $user->id && Gate::allows('manage-client-things'))) {
            $feedback->delete();

            return response()->json([
                'message' => 'Feedback deleted successfully.',
            ]);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }
}
