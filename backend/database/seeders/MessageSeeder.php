<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Ensure the storage directory for attachments exists
        Storage::disk('public')->makeDirectory('messages/attachments');

        // Retrieve all users to randomly assign sender and receiver
        $users = User::all();

        // Seed 50 random messages
        Message::factory(50)->make()->each(function ($message) use ($users) {
            // Random sender and receiver
            $sender = $users->random();
            $receiver = $users->where('id', '!=', $sender->id)->random();  // Ensure receiver is not the sender

            // Random file attachment logic
            $hasFile = random_int(0, 1);  // 50% chance of attaching a file

            $message->sender_id = $sender->id;
            $message->receiver_id = $receiver->id;
            $message->file_name = $hasFile ? 'sample_attachment.txt' : null;
            $message->file_path = $hasFile ? Storage::disk('public')->put('messages/attachments', 'sample_attachment.txt') : null;

            $message->save();
        });
    }
}
