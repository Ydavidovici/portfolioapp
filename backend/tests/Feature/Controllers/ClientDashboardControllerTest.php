<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Message;
use App\Models\Document;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
     * Test that an admin can access the client dashboard.
     */
    public function test_admin_can_access_client_dashboard()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create messages and documents for the admin
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $admin->id,
        ]);

        $documents = Document::factory()->count(5)->create([
            'uploaded_by' => $admin->id,
        ]);

        // Act
        $response = $this->actingAs($admin)->get('/client/dashboard');

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

        // Create messages and documents for the client
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $client->id,
        ]);

        $documents = Document::factory()->count(5)->create([
            'uploaded_by' => $client->id,
        ]);

        // Act
        $response = $this->actingAs($client)->get('/client/dashboard');

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

        // Act
        $response = $this->actingAs($developer)->get('/client/dashboard');

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

        // Act
        $response = $this->actingAs($user)->get('/client/dashboard');

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
        $response = $this->get('/client/dashboard');

        // Assert
        $response->assertStatus(401);
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
        $response = $this->actingAs($client)->get('/client/dashboard');

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