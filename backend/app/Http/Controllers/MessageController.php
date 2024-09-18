<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Mail\NewMessageNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'content' => 'required|string',
            'receiver_id' => 'required|exists:users,id',
            'file' => 'nullable|file|max:2048',  // Optional file validation
        ]);

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
            'sender_id' => auth()->id(),
            'receiver_id' => $validated['receiver_id'],
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        // Send email notification
        $receiver = User::find($validated['receiver_id']);
        Mail::to($receiver->email)->send(new NewMessageNotification($message));

        return response()->json($message, 201);
    }

    public function downloadAttachment($messageId)
    {
        $message = Message::findOrFail($messageId);

        if (!$message->file_path) {
            return response()->json(['message' => 'No file attached'], 404);
        }

        return Storage::disk('public')->download($message->file_path, $message->file_name);
    }
}
