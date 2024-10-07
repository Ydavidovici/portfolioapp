<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Mail\NewMessageNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Store a newly created message in storage (Create).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'content' => 'required|string',
            'receiver_id' => 'required|exists:users,id',
            'file' => 'nullable|file|max:2048',
        ]);

        $user = $request->user();  // Retrieve authenticated user from the request

        // Authorization: Clients, Admins, and Developers can send messages
        if (!Gate::allows('manage-client-things') && !Gate::allows('perform-crud-operations')) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        // Handle file upload
        $filePath = null;
        $fileName = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('messages/attachments', 'public');
        }

        // Create the message
        $message = Message::create([
            'content' => $validated['content'],
            'sender_id' => $user->id,
            'receiver_id' => $validated['receiver_id'],
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        // Send notification to the receiver
        $receiver = User::find($validated['receiver_id']);
        Notification::send($receiver, new NewMessageNotification($message));

        return response()->json($message, 201);
    }

    /**
     * Display a listing of the messages (Read all).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            $messages = Message::with(['sender', 'receiver'])->get();
        } elseif (Gate::allows('manage-client-things')) {
            $messages = Message::with(['sender', 'receiver'])
                ->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id)
                ->get();
        } else {
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }

        return response()->json($messages);
    }

    /**
     * Display the specified message (Read one).
     *
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Message $message)
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations') ||
            ($message->sender_id === $user->id || $message->receiver_id === $user->id)
        ) {
            return response()->json($message->load(['sender', 'receiver']));
        }

        return response()->json(['message' => 'This action is unauthorized.'], 403);
    }

    /**
     * Update the specified message in storage (Update).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Message $message)
    {
        Gate::authorize('perform-crud-operations');

        $validated = $request->validate([
            'content' => 'sometimes|required|string',
            'receiver_id' => 'sometimes|required|exists:users,id',
            'file' => 'nullable|file|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($message->file_path) {
                Storage::disk('public')->delete($message->file_path);
            }

            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('messages/attachments', 'public');

            $validated['file_path'] = $filePath;
            $validated['file_name'] = $fileName;
        }

        $message->update($validated);

        return response()->json([
            'message' => 'Message updated successfully.',
            'message_data' => $message,
        ]);
    }

    /**
     * Remove the specified message from storage (Delete).
     *
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Message $message)
    {
        Gate::authorize('perform-crud-operations');

        if ($message->file_path) {
            Storage::disk('public')->delete($message->file_path);
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted successfully.']);
    }
}
