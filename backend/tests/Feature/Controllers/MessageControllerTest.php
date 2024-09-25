<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MessageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Test that a client can send a message.
     */
    public function test_client_can_send_message()
    {
        // Fake events and notifications
        Event::fake();
        Notification::fake();

        // Create a client user
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        $this->assertTrue($client->hasRole('client'), "The user does not have the 'client' role.");

        // Create a receiver user
        $receiver = User::factory()->create([
            'password' => Hash::make('receiverpassword'),
        ]);

        // Define message data
        $messageData = [
            'content' => 'Hello, this is a test message.',
            'receiver_id' => $receiver->id,
        ];

        // Act as the client and send a message
        $response = $this->actingAs($client, 'sanctum')->postJson('/send-message', $messageData);

        // Assert that the message was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello, this is a test message.',
                'sender_id' => $client->id,
                'receiver_id' => $receiver->id,
            ]);

        // Assert that the message exists in the database
        $this->assertDatabaseHas('messages', [
            'content' => 'Hello, this is a test message.',
            'sender_id' => $client->id,
            'receiver_id' => $receiver->id,
        ]);

        // Assert that the MessageSent event was dispatched
        Event::assertDispatched(MessageSent::class, function ($event) use ($client, $receiver) {
            return $event->message->sender_id === $client->id &&
                $event->message->receiver_id === $receiver->id;
        });

        // Assert that the NewMessageNotification was sent to the receiver
        Notification::assertSentTo(
            [$receiver], \App\Notifications\NewMessageNotification::class
        );
    }

    /**
     * Test that a non-authorized user cannot send a message.
     */
    public function test_non_authorized_user_cannot_send_message()
    {
        // Fake events and notifications
        Event::fake();
        Notification::fake();

        // Create a user without necessary roles
        $user = User::factory()->create([
            'password' => Hash::make('userpassword'),
        ]);

        // Create a receiver user
        $receiver = User::factory()->create([
            'password' => Hash::make('receiverpassword'),
        ]);

        // Define message data
        $messageData = [
            'content' => 'Unauthorized message attempt.',
            'receiver_id' => $receiver->id,
        ];

        // Act as the unauthorized user and attempt to send a message
        $response = $this->actingAs($user, 'sanctum')->postJson('/send-message', $messageData);

        // Assert that the action is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Assert that the message was not created in the database
        $this->assertDatabaseMissing('messages', [
            'content' => 'Unauthorized message attempt.',
            'sender_id' => $user->id,
            'receiver_id' => $receiver->id,
        ]);

        // Assert that no events or notifications were dispatched
        Event::assertNotDispatched(MessageSent::class);
        Notification::assertNothingSent();
    }

    // Additional test methods as needed...
}
