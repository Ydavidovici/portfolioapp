<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Message;
use App\Models\Document;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ClientDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Seed the roles into the database
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Authenticate a user and return headers with the Bearer token.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    protected function authenticate(User $user)
    {
        $token = Str::random(60);
        $user->api_token = hash('sha256', $token);
        $user->save();

        return [
            'Authorization' => 'Bearer ' . $token,
        ];
    }

    /**
     * Test that an admin can access the client dashboard.
     */
    public function test_admin_can_access_client_dashboard()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        // Create messages and documents for the admin
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $admin->id,
        ]);

        $documents = Document::factory()->count(5)->create([
            'uploaded_by' => $admin->id,
        ]);

        // Act
        $response = $this->withHeaders($headers)->getJson('/client/dashboard');

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Client Dashboard',
            ])
            ->assertJsonCount(5, 'messages')
            ->assertJsonCount(5, 'documents');
    }

    /**
     * Test that a client can access the client dashboard.
     */
    public function test_client_can_access_client_dashboard()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        // Create messages and documents for the client
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $client->id,
        ]);

        $documents = Document::factory()->count(5)->create([
            'uploaded_by' => $client->id,
        ]);

        // Act
        $response = $this->withHeaders($headers)->getJson('/client/dashboard');

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Client Dashboard',
            ])
            ->assertJsonCount(5, 'messages')
            ->assertJsonCount(5, 'documents');
    }

    /**
     * Test that a developer cannot access the client dashboard.
     */
    public function test_developer_cannot_access_client_dashboard()
    {
        // Arrange
        $developerRole = Role::where('name', 'developer')->first();
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Authenticate the developer and get headers
        $headers = $this->authenticate($developer);

        // Act
        $response = $this->withHeaders($headers)->getJson('/client/dashboard');

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that a user with no role cannot access the client dashboard.
     */
    public function test_user_with_no_role_cannot_access_client_dashboard()
    {
        // Arrange
        $user = User::factory()->create();

        // Authenticate the user and get headers
        $headers = $this->authenticate($user);

        // Act
        $response = $this->withHeaders($headers)->getJson('/client/dashboard');

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access the client dashboard.
     */
    public function test_unauthenticated_user_cannot_access_client_dashboard()
    {
        // Act
        $response = $this->getJson('/client/dashboard');

        // Assert
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test that the client dashboard returns the correct messages and documents.
     */
    public function test_client_dashboard_returns_correct_data()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        // Create specific messages and documents for the client
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $client->id,
            'content' => 'Test message content',
        ]);

        $documents = Document::factory()->count(5)->create([
            'uploaded_by' => $client->id,
            'name' => 'Test Document Name',
        ]);

        // Act
        $response = $this->withHeaders($headers)->getJson('/client/dashboard');

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Client Dashboard',
            ]);

        // Verify that each message is present in the response
        foreach ($messages as $message) {
            $response->assertJsonFragment([
                'id' => $message->id,
                'content' => 'Test message content',
            ]);
        }

        // Verify that each document is present in the response
        foreach ($documents as $document) {
            $response->assertJsonFragment([
                'id' => $document->id,
                'name' => 'Test Document Name',
            ]);
        }
    }
}