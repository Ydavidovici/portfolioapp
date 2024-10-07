<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use App\Mail\NewMessageNotification;  // Correct mail reference

class MessageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    protected function getAuthHeaders(User $user)
    {
        $token = 'fixedapitoken1234567890abcdef';
        $user->api_token = hash('sha256', $token);
        $user->save();

        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ];
    }

    public function test_client_can_send_message()
    {
        Notification::fake();

        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create(['password' => Hash::make('clientpassword')]);
        $client->roles()->attach($clientRole);

        $receiver = User::factory()->create(['password' => Hash::make('receiverpassword')]);

        $messageData = [
            'content' => 'Hello, this is a test message.',
            'receiver_id' => $receiver->id,
        ];

        $headers = $this->getAuthHeaders($client);

        $response = $this->withHeaders($headers)->postJson('/messages', $messageData);

        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello, this is a test message.',
                'sender_id' => $client->id,
                'receiver_id' => $receiver->id,
            ]);

        $this->assertDatabaseHas('messages', [
            'content' => 'Hello, this is a test message.',
            'sender_id' => $client->id,
            'receiver_id' => $receiver->id,
        ]);

        Notification::assertSentTo(
            [$receiver],
            NewMessageNotification::class,
            function ($notification, $channels) use ($receiver) {
                return $notification->message->receiver_id === $receiver->id;
            }
        );
    }

    public function test_can_read_all_messages()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create(['password' => Hash::make('adminpassword')]);
        $admin->roles()->attach($adminRole);

        Message::factory(3)->create();

        $headers = $this->getAuthHeaders($admin);

        $response = $this->withHeaders($headers)->getJson('/messages');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }

    public function test_can_read_single_message()
    {
        $client = User::factory()->create();
        $message = Message::factory()->create(['sender_id' => $client->id]);

        $headers = $this->getAuthHeaders($client);

        $response = $this->withHeaders($headers)->getJson("/messages/{$message->id}");

        $response->assertStatus(200)
            ->assertJson([
                'content' => $message->content,
                'sender_id' => $client->id,
            ]);
    }

    public function test_can_update_message()
    {
        $admin = User::factory()->create();
        $message = Message::factory()->create();

        $headers = $this->getAuthHeaders($admin);

        $updatedData = ['content' => 'Updated message content'];

        $response = $this->withHeaders($headers)->putJson("/messages/{$message->id}", $updatedData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Message updated successfully.',
            ]);

        $this->assertDatabaseHas('messages', [
            'content' => 'Updated message content',
        ]);
    }

    public function test_can_delete_message()
    {
        $admin = User::factory()->create();
        $message = Message::factory()->create();

        $headers = $this->getAuthHeaders($admin);

        $response = $this->withHeaders($headers)->deleteJson("/messages/{$message->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Message deleted successfully.',
            ]);

        $this->assertDatabaseMissing('messages', ['id' => $message->id]);
    }
}
