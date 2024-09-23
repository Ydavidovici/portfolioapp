<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles: admin, developer, client
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Test that an admin can view all users.
     *
     * @return void
     */
    public function test_admin_can_view_all_users()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create additional users
        User::factory()->count(3)->create()->each(function ($user) {
            $user->roles()->attach(Role::where('name', 'client')->first());
        });

        // Act as the admin and make a GET request to the users index
        $response = $this->actingAs($admin, 'sanctum')->get('/api/users');

        // Assert that the response is successful and contains all users
        $response->assertStatus(200)
            ->assertJsonCount(4); // 1 admin + 3 clients
    }

    /**
     * Test that a developer cannot view all users.
     *
     * @return void
     */
    public function test_developer_cannot_view_all_users()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Act as the developer and make a GET request to the users index
        $response = $this->actingAs($developer, 'sanctum')->get('/api/users');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that a client cannot view all users.
     *
     * @return void
     */
    public function test_client_cannot_view_all_users()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Act as the client and make a GET request to the users index
        $response = $this->actingAs($client, 'sanctum')->get('/api/users');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that an admin can create a new user.
     *
     * @return void
     */
    public function test_admin_can_create_user()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define user data
        $userData = [
            'username' => 'newuser',
            'email'    => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles'    => [Role::where('name', 'client')->first()->id],
        ];

        // Act as the admin and make a POST request to create a new user
        $response = $this->actingAs($admin, 'sanctum')->post('/api/users', $userData);

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
     *
     * @return void
     */
    public function test_developer_cannot_create_user()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define user data
        $userData = [
            'username' => 'newuser',
            'email'    => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles'    => [Role::where('name', 'client')->first()->id],
        ];

        // Act as the developer and make a POST request to create a new user
        $response = $this->actingAs($developer, 'sanctum')->post('/api/users', $userData);

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
     *
     * @return void
     */
    public function test_admin_can_update_user()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

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

        // Act as the admin and make a PUT request to update the user
        $response = $this->actingAs($admin, 'sanctum')->put("/api/users/{$user->id}", $updatedData);

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
     *
     * @return void
     */
    public function test_developer_cannot_update_user()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

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

        // Act as the developer and make a PUT request to update the user
        $response = $this->actingAs($developer, 'sanctum')->put("/api/users/{$user->id}", $updatedData);

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
     *
     * @return void
     */
    public function test_admin_can_delete_user()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a user to delete
        $user = User::factory()->create([
            'username' => 'userToDelete',
            'email'    => 'delete@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the admin and make a DELETE request to delete the user
        $response = $this->actingAs($admin, 'sanctum')->delete("/api/users/{$user->id}");

        // Assert that the user was deleted successfully
        $response->assertStatus(204);

        // Verify that the user no longer exists in the database
        $this->assertDatabaseMissing('users', ['email' => 'delete@example.com']);
    }

    /**
     * Test that a developer cannot delete a user.
     *
     * @return void
     */
    public function test_developer_cannot_delete_user()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a user to delete
        $user = User::factory()->create([
            'username' => 'userToDelete',
            'email'    => 'delete@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the developer and make a DELETE request to delete the user
        $response = $this->actingAs($developer, 'sanctum')->delete("/api/users/{$user->id}");

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
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_view_users()
    {
        // Make a GET request to the users index without authentication
        $response = $this->get('/api/users');

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401);
    }
}
