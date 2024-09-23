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
     * Test that an admin can access the client dashboard.
     *
     * @return void
     */
    public function test_admin_can_access_client_dashboard()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create messages and documents for the admin
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $admin->id,
        ]);

        $documents = Document::factory()->count(5)->create([
            'owner_id' => $admin->id,
        ]);

        // Act as the admin and make a GET request to the client dashboard
        $response = $this->actingAs($admin, 'sanctum')->get('/api/client/dashboard');

        // Assert that the response is successful and contains the expected data
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Client Dashboard',
            ])
            ->assertJsonCount(5, 'messages')
            ->assertJsonCount(5, 'documents');
    }

    /**
     * Test that a client can access the client dashboard.
     *
     * @return void
     */
    public function test_client_can_access_client_dashboard()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create messages and documents for the client
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $client->id,
        ]);

        $documents = Document::factory()->count(5)->create([
            'owner_id' => $client->id,
        ]);

        // Act as the client and make a GET request to the client dashboard
        $response = $this->actingAs($client, 'sanctum')->get('/api/client/dashboard');

        // Assert that the response is successful and contains the expected data
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Client Dashboard',
            ])
            ->assertJsonCount(5, 'messages')
            ->assertJsonCount(5, 'documents');
    }

    /**
     * Test that a developer cannot access the client dashboard.
     *
     * @return void
     */
    public function test_developer_cannot_access_client_dashboard()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Act as the developer and make a GET request to the client dashboard
        $response = $this->actingAs($developer, 'sanctum')->get('/api/client/dashboard');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that a user with no role cannot access the client dashboard.
     *
     * @return void
     */
    public function test_user_with_no_role_cannot_access_client_dashboard()
    {
        // Create a user without any roles
        $user = User::factory()->create();

        // Act as the user and make a GET request to the client dashboard
        $response = $this->actingAs($user, 'sanctum')->get('/api/client/dashboard');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access the client dashboard.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_client_dashboard()
    {
        // Make a GET request to the client dashboard without authentication
        $response = $this->get('/api/client/dashboard');

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401);
    }

    /**
     * Test that the client dashboard returns the correct messages and documents.
     *
     * @return void
     */
    public function test_client_dashboard_returns_correct_data()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create 5 specific messages and 5 specific documents for the client
        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $client->id,
            'content' => 'Test message content',
        ]);

        $documents = Document::factory()->count(5)->create([
            'owner_id' => $client->id,
            'title' => 'Test Document Title',
        ]);

        // Act as the client and make a GET request to the client dashboard
        $response = $this->actingAs($client, 'sanctum')->get('/api/client/dashboard');

        // Assert that the response contains the specific messages and documents
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
                'title' => 'Test Document Title',
            ]);
        }
    }
}
