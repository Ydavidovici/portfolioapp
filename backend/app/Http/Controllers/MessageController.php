<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Mail\NewMessageNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
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
     * Store a newly created message in storage.
     *
     * Clients can send messages; Admins and Developers can also send messages.
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
            'file' => 'nullable|file|max:2048',  // Optional file validation
        ]);

        $user = auth()->user();

        // Authorization: Clients can send messages; Admins and Developers can also send messages
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
            $filePath = $file->store('messages/attachments', 'public');  // Save to the public disk
        }

        // Create the message
        $message = Message::create([
            'content' => $validated['content'],
            'sender_id' => $user->id,
            'receiver_id' => $validated['receiver_id'],
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        // Send email notification
        $receiver = User::find($validated['receiver_id']);
        Mail::to($receiver->email)->send(new NewMessageNotification($message));

        return response()->json($message, 201);
    }

    /**
     * Display a listing of the messages.
     *
     * Admins and Developers can view all messages.
     * Clients can view messages they've sent or received.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();

        if (Gate::allows('perform-crud-operations')) {
            // Admins and Developers can view all messages
            $messages = Message::with(['sender', 'receiver'])->get();
        } elseif (Gate::allows('manage-client-things')) {
            // Clients can view messages they've sent or received
            $messages = Message::with(['sender', 'receiver'])
                ->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id)
                ->get();
        } else {
            // Other roles (if any) cannot view messages
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json($messages);
    }

    /**
     * Display the specified message.
     *
     * Admins and Developers can view any message.
     * Clients can view messages they've sent or received.
     *
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Message $message)
    {
        $user = auth()->user();

        if (
            Gate::allows('perform-crud-operations') ||
            ($message->sender_id === $user->id || $message->receiver_id === $user->id) && Gate::allows('manage-client-things')
        ) {
            // Admins and Developers can view any message
            // Clients can view messages they've sent or received
            return response()->json($message->load(['sender', 'receiver']));
        }

        // Unauthorized access
        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }

    /**
     * Update the specified message in storage.
     *
     * Only Admins and Developers can update messages.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Message $message)
    {
        // Only Admins and Developers can update messages
        Gate::authorize('perform-crud-operations');

        // Validate input
        $validated = $request->validate([
            'content' => 'sometimes|required|string',
            'receiver_id' => 'sometimes|required|exists:users,id',
            'file' => 'nullable|file|max:2048',
        ]);

        $user = auth()->user();

        // Handle file upload if present
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($message->file_path) {
                Storage::disk('public')->delete($message->file_path);
            }

            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('messages/attachments', 'public');

            $validated['file_path'] = $filePath;
            $validated['file_name'] = $fileName;
        }

        // Update the message
        $message->update($validated);

        return response()->json([
            'message' => 'Message updated successfully.',
            'message_data' => $message,
        ]);
    }

    /**
     * Remove the specified message from storage.
     *
     * Only Admins and Developers can delete messages.
     *
     * @param  \App\Models\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Message $message)
    {
        // Only Admins and Developers can delete messages
        Gate::authorize('perform-crud-operations');

        // Delete attached file if exists
        if ($message->file_path) {
            Storage::disk('public')->delete($message->file_path);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }

    /**
     * Download the attachment of a specific message.
     *
     * Admins and Developers can download any attachment.
     * Clients can download attachments only if they are the sender or receiver.
     *
     * @param  int  $messageId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function downloadAttachment($messageId)
    {
        $message = Message::findOrFail($messageId);
        $user = auth()->user();

        if (
            Gate::allows('perform-crud-operations') ||
            ($message->sender_id === $user->id || $message->receiver_id === $user->id) && Gate::allows('manage-client-things')
        ) {
            if (!$message->file_path) {
                return response()->json(['message' => 'No file attached'], 404);
            }

            return Storage::disk('public')->download($message->file_path, $message->file_name);
        }

        return response()->json([
            'message' => 'This action is unauthorized.',
        ], 403);
    }
}
