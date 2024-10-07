<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class DeveloperDashboardControllerTest extends TestCase
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
     * Test that an admin can access the developer dashboard.
     *
     * @return void
     */
    public function test_admin_can_access_developer_dashboard()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        // Create projects and messages for the admin
        $projects = Project::factory()->count(3)->create([
            'client_id' => User::factory()->create()->id,
        ]);

        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $admin->id,
        ]);

        // Act: Make a GET request to the developer dashboard with the token
        $response = $this->withHeaders($headers)->getJson('/developer/dashboard');

        // Assert that the response is successful and contains the expected data
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Developer Dashboard',
            ])
            ->assertJsonCount(3, 'projects')
            ->assertJsonCount(5, 'messages');
    }

    /**
     * Test that a developer can access the developer dashboard.
     *
     * @return void
     */
    public function test_developer_can_access_developer_dashboard()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Authenticate the developer and get headers
        $headers = $this->authenticate($developer);

        // Create projects and messages for the developer
        $projects = Project::factory()->count(3)->create([
            'client_id' => User::factory()->create()->id,
        ]);

        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $developer->id,
        ]);

        // Act: Make a GET request to the developer dashboard with the token
        $response = $this->withHeaders($headers)->getJson('/developer/dashboard');

        // Assert that the response is successful and contains the expected data
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Developer Dashboard',
            ])
            ->assertJsonCount(3, 'projects')
            ->assertJsonCount(5, 'messages');
    }

    /**
     * Test that a client cannot access the developer dashboard.
     *
     * @return void
     */
    public function test_client_cannot_access_developer_dashboard()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        // Act: Make a GET request to the developer dashboard with the token
        $response = $this->withHeaders($headers)->getJson('/developer/dashboard');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that a user with no role cannot access the developer dashboard.
     *
     * @return void
     */
    public function test_user_with_no_role_cannot_access_developer_dashboard()
    {
        // Create a user without any roles
        $user = User::factory()->create();

        // Authenticate the user and get headers
        $headers = $this->authenticate($user);

        // Act: Make a GET request to the developer dashboard with the token
        $response = $this->withHeaders($headers)->getJson('/developer/dashboard');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access the developer dashboard.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_developer_dashboard()
    {
        // Make a GET request to the developer dashboard without authentication
        $response = $this->getJson('/developer/dashboard');

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test that the developer dashboard returns the correct projects and messages.
     *
     * @return void
     */
    public function test_developer_dashboard_returns_correct_data()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Authenticate the developer and get headers
        $headers = $this->authenticate($developer);

        // Create specific projects and messages for the developer
        $projects = Project::factory()->count(3)->create([
            'client_id' => User::factory()->create()->id,
            'name' => 'Developer Project',
        ]);

        $messages = Message::factory()->count(5)->create([
            'receiver_id' => $developer->id,
            'content' => 'Developer-specific message',
        ]);

        // Act: Make a GET request to the developer dashboard with the token
        $response = $this->withHeaders($headers)->getJson('/developer/dashboard');

        // Assert that the response contains the specific projects and messages
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Developer Dashboard',
            ]);

        // Verify that each project is present in the response
        foreach ($projects as $project) {
            $response->assertJsonFragment([
                'id' => $project->id,
                'name' => 'Developer Project',
            ]);
        }

        // Verify that each message is present in the response
        foreach ($messages as $message) {
            $response->assertJsonFragment([
                'id' => $message->id,
                'content' => 'Developer-specific message',
            ]);
        }
    }
}
