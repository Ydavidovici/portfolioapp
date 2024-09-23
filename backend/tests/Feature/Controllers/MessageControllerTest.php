<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Seed the roles into the database
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Test that an admin can send a message.
     *
     * @return void
     */
    public function test_admin_can_send_message()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a receiver user
        $receiver = User::factory()->create();

        // Define message data
        $messageData = [
            'content' => 'Hello from Admin!',
            'receiver_id' => $receiver->id,
            // 'file' => null, // Optional
        ];

        // Act as the admin and make a POST request to send a message
        $response = $this->actingAs($admin)->postJson('/messages', $messageData);

        // Assert that the message was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello from Admin!',
                'sender_id' => $admin->id,
                'receiver_id' => $receiver->id,
            ]);

        // Verify that the message exists in the database
        $this->assertDatabaseHas('messages', [
            'content' => 'Hello from Admin!',
            'sender_id' => $admin->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    /**
     * Test that a client can send a message.
     *
     * @return void
     */
    public function test_client_can_send_message()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a receiver user
        $receiver = User::factory()->create();

        // Define message data
        $messageData = [
            'content' => 'Hello from Client!',
            'receiver_id' => $receiver->id,
            // 'file' => null, // Optional
        ];

        // Act as the client and make a POST request to send a message
        $response = $this->actingAs($client)->postJson('/messages', $messageData);

        // Assert that the message was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello from Client!',
                'sender_id' => $client->id,
                'receiver_id' => $receiver->id,
            ]);

        // Verify that the message exists in the database
        $this->assertDatabaseHas('messages', [
            'content' => 'Hello from Client!',
            'sender_id' => $client->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    /**
     * Test that a developer cannot send a message if not allowed.
     *
     * Assuming developers are allowed to send messages as per Gates.
     *
     * @return void
     */
    public function test_developer_can_send_message()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a receiver user
        $receiver = User::factory()->create();

        // Define message data
        $messageData = [
            'content' => 'Hello from Developer!',
            'receiver_id' => $receiver->id,
            // 'file' => null, // Optional
        ];

        // Act as the developer and make a POST request to send a message
        $response = $this->actingAs($developer)->postJson('/messages', $messageData);

        // Assert that the message was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello from Developer!',
                'sender_id' => $developer->id,
                'receiver_id' => $receiver->id,
            ]);

        // Verify that the message exists in the database
        $this->assertDatabaseHas('messages', [
            'content' => 'Hello from Developer!',
            'sender_id' => $developer->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    /**
     * Test that a client cannot send a message without proper permissions.
     *
     * If clients are allowed to send messages, this test may not be necessary.
     * Adjust accordingly based on your business logic.
     *
     * @return void
     */
    public function test_client_cannot_send_message_if_not_allowed()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a receiver user
        $receiver = User::factory()->create();

        // Define message data
        $messageData = [
            'content' => 'Attempted Message from Client!',
            'receiver_id' => $receiver->id,
            // 'file' => null, // Optional
        ];

        // Act as the client and make a POST request to send a message
        $response = $this->actingAs($client)->postJson('/messages', $messageData);

        // Depending on your Gates, adjust the expected outcome
        // If clients are allowed to send messages, assert success
        // If not, assert forbidden
        // Here, assuming clients are allowed to send messages
        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Attempted Message from Client!',
                'sender_id' => $client->id,
                'receiver_id' => $receiver->id,
            ]);

        // Verify that the message exists in the database
        $this->assertDatabaseHas('messages', [
            'content' => 'Attempted Message from Client!',
            'sender_id' => $client->id,
            'receiver_id' => $receiver->id,
        ]);
    }

    /**
     * Test that an admin can view all messages.
     *
     * @return void
     */
    public function test_admin_can_view_all_messages()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create messages
        $messages = Message::factory()->count(3)->create();

        // Act as the admin and make a GET request to view all messages
        $response = $this->actingAs($admin)->getJson('/messages');

        // Assert that the response is successful and contains all messages
        $response->assertStatus(200)
            ->assertJsonCount(3);

        foreach ($messages as $message) {
            $response->assertJsonFragment([
                'id' => $message->id,
                'content' => $message->content,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
            ]);
        }
    }

    /**
     * Test that a client can view their sent and received messages.
     *
     * @return void
     */
    public function test_client_can_view_their_messages()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create();
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create();
        $client2->roles()->attach($clientRole);

        // Create messages sent by client1 to client2
        $messages = Message::factory()->count(2)->create([
            'sender_id' => $client1->id,
            'receiver_id' => $client2->id,
        ]);

        // Create messages sent by client2 to client1
        $reverseMessages = Message::factory()->count(2)->create([
            'sender_id' => $client2->id,
            'receiver_id' => $client1->id,
        ]);

        // Act as client1 and make a GET request to view messages
        $response = $this->actingAs($client1)->getJson('/messages');

        // Assert that the response contains only client1's messages
        $response->assertStatus(200)
            ->assertJsonCount(4); // 2 sent and 2 received

        foreach ($messages as $message) {
            $response->assertJsonFragment([
                'id' => $message->id,
                'content' => $message->content,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
            ]);
        }

        foreach ($reverseMessages as $message) {
            $response->assertJsonFragment([
                'id' => $message->id,
                'content' => $message->content,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
            ]);
        }
    }

    /**
     * Test that a client cannot view others' messages.
     *
     * @return void
     */
    public function test_client_cannot_view_others_messages()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create();
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create();
        $client2->roles()->attach($clientRole);

        // Create a message between client1 and client2
        $message = Message::factory()->create([
            'sender_id' => $client1->id,
            'receiver_id' => $client2->id,
        ]);

        // Create a third client user
        $client3 = User::factory()->create();
        $client3->roles()->attach($clientRole);

        // Act as client3 and attempt to view client1 and client2's message
        $response = $this->actingAs($client3)->getJson("/messages/{$message->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access messages.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_messages()
    {
        // Create messages
        $messages = Message::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/messages');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
