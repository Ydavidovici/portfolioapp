<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles: admin, developer, client
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Helper method to create a user with a specific role and a unique API token.
     */
    protected function createUserWithRoleAndToken($roleName)
    {
        $role = Role::where('name', $roleName)->firstOrFail();

        $user = User::factory()->create();
        $user->roles()->attach($role);

        // Generate a unique API token for the user
        $plainToken = Str::random(60);
        $user->api_token = hash('sha256', $plainToken);
        $user->save();

        // Store the plain token for use in the test
        $user->plainApiToken = $plainToken;

        return $user;
    }

    /**
     * Test that an admin can view all users.
     */
    public function test_admin_can_view_all_users()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create additional users and associate projects
        User::factory()->count(3)->create()->each(function ($user) {
            $user->roles()->attach(Role::where('name', 'client')->first());

            // Create projects and associate them with the user
            $projects = Project::factory()->count(2)->create();
            $user->projects()->attach($projects->pluck('id')->toArray());
        });

        // Act as the admin and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->get('/users');

        // Assert that the response is successful and contains all users
        $response->assertStatus(200)
            ->assertJsonCount(10);
    }

    /**
     * Test that a developer cannot view all users.
     */
    public function test_developer_cannot_view_all_users()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Act as the developer and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->get('/users');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that a client cannot view all users.
     */
    public function test_client_cannot_view_all_users()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Act as the client and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->get('/users');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that an admin can create a new user.
     */
    public function test_admin_can_create_user()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Ensure the 'client' role exists
        $clientRole = Role::where('name', 'client')->first();
        if (!$clientRole) {
            $clientRole = Role::create(['name' => 'client']);
        }

        // Define user data
        $userData = [
            'username' => 'newuser',
            'email'    => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles'    => [$clientRole->id],
        ];

        // Act as the admin and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->post('/users', $userData);

        // Assert that the user was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'username' => 'newuser',
                'email'    => 'newuser@example.com',
            ]);

        // Verify that the user exists in the database
        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
    }


    /**
     * Test that a developer cannot create a new user.
     */
    public function test_developer_cannot_create_user()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Define user data
        $userData = [
            'username' => 'newuser',
            'email'    => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles'    => [Role::where('name', 'client')->first()->id],
        ];

        // Act as the developer and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->post('/users', $userData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the user does not exist in the database
        $this->assertDatabaseMissing('users', ['email' => 'newuser@example.com']);
    }

    /**
     * Test that an admin can update a user.
     */
    public function test_admin_can_update_user()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a user to update
        $user = User::factory()->create([
            'username' => 'oldusername',
            'email'    => 'oldemail@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Define updated user data
        $updatedData = [
            'username' => 'updatedusername',
            'email'    => 'updatedemail@example.com',
            'roles'    => [Role::where('name', 'developer')->first()->id],
        ];

        // Act as the admin and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->put("/users/{$user->id}", $updatedData);

        // Assert that the user was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'username' => 'updatedusername',
                'email'    => 'updatedemail@example.com',
            ]);

        // Verify that the user was updated in the database
        $this->assertDatabaseHas('users', ['email' => 'updatedemail@example.com']);
        $this->assertDatabaseMissing('users', ['email' => 'oldemail@example.com']);

        // Verify that the user's role was updated
        $this->assertTrue($user->fresh()->hasRole('developer'));
    }

    /**
     * Test that a developer cannot update a user.
     */
    public function test_developer_cannot_update_user()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a user to update
        $user = User::factory()->create([
            'username' => 'oldusername',
            'email'    => 'oldemail@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Define updated user data
        $updatedData = [
            'username' => 'updatedusername',
            'email'    => 'updatedemail@example.com',
            'roles'    => [Role::where('name', 'developer')->first()->id],
        ];

        // Act as the developer and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->put("/users/{$user->id}", $updatedData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the user was not updated in the database
        $this->assertDatabaseHas('users', ['email' => 'oldemail@example.com']);
        $this->assertDatabaseMissing('users', ['email' => 'updatedemail@example.com']);
    }

    /**
     * Test that an admin can delete a user.
     */
    public function test_admin_can_delete_user()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a user to delete
        $user = User::factory()->create([
            'username' => 'userToDelete',
            'email'    => 'delete@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the admin and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->delete("/users/{$user->id}");

        // Assert that the user was deleted successfully
        $response->assertStatus(204);

        // Verify that the user no longer exists in the database
        $this->assertDatabaseMissing('users', ['email' => 'delete@example.com']);
    }

    /**
     * Test that a developer cannot delete a user.
     */
    public function test_developer_cannot_delete_user()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a user to delete
        $user = User::factory()->create([
            'username' => 'userToDelete',
            'email'    => 'delete@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the developer and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->delete("/users/{$user->id}");

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the user still exists in the database
        $this->assertDatabaseHas('users', ['email' => 'delete@example.com']);
    }

    /**
     * Test that an unauthenticated user cannot access the users index.
     */
    public function test_unauthenticated_user_cannot_view_users()
    {
        // Make a GET request to the users index without authentication
        $response = $this->get('/users');

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
