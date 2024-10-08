<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles: admin, developer, client
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Helper method to create a user with a specific role and a unique API token.
     *
     * @param string $roleName
     * @return User
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
     * Test that an admin can view all roles.
     *
     * @return void
     */
    public function test_admin_can_view_all_roles()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create additional roles
        Role::factory()->count(3)->create();

        // Act as the admin and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->get('/roles');

        // Assert that the response is successful and contains all roles
        $response->assertStatus(200)
            ->assertJsonCount(6);
    }

    /**
     * Test that a developer cannot view roles.
     *
     * @return void
     */
    public function test_developer_cannot_view_roles()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Act as the developer and make a GET request to the roles index
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->get('/roles');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that a client cannot view roles.
     *
     * @return void
     */
    public function test_client_cannot_view_roles()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Act as the client and make a GET request to the roles index
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->get('/roles');

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    /**
     * Test that unauthenticated users cannot view roles.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_view_roles()
    {
        // Make a GET request to the roles index without authentication
        $response = $this->get('/roles');

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test that an admin can create a new role.
     *
     * @return void
     */
    public function test_admin_can_create_role()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Define role data
        $roleData = [
            'name' => 'tester',
        ];

        // Act as the admin and make a POST request to create a new role
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->post('/roles', $roleData);

        // Assert that the role was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'name' => 'tester',
            ]);

        // Verify that the role exists in the database
        $this->assertDatabaseHas('roles', ['name' => 'tester']);
    }

    /**
     * Test that a developer cannot create a new role.
     *
     * @return void
     */
    public function test_developer_cannot_create_role()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Define role data
        $roleData = [
            'name' => 'tester',
        ];

        // Act as the developer and make a POST request to create a new role
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->post('/roles', $roleData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the role does not exist in the database
        $this->assertDatabaseMissing('roles', ['name' => 'tester']);
    }

    /**
     * Test that an admin can update a role.
     *
     * @return void
     */
    public function test_admin_can_update_role()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a role to update
        $role = Role::create(['name' => 'tester']);

        // Define updated role data
        $updatedData = [
            'name' => 'qa-tester',
        ];

        // Act as the admin and make a PUT request to update the role
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->put("/roles/{$role->id}", $updatedData);

        // Assert that the role was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'qa-tester',
            ]);

        // Verify that the role was updated in the database
        $this->assertDatabaseHas('roles', ['name' => 'qa-tester']);
    }

    /**
     * Test that a developer cannot update a role.
     *
     * @return void
     */
    public function test_developer_cannot_update_role()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a role to update
        $role = Role::create(['name' => 'tester']);

        // Define updated role data
        $updatedData = [
            'name' => 'qa-tester',
        ];

        // Act as the developer and make a PUT request to update the role
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->put("/roles/{$role->id}", $updatedData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the role was not updated in the database
        $this->assertDatabaseHas('roles', ['name' => 'tester']);
        $this->assertDatabaseMissing('roles', ['name' => 'qa-tester']);
    }

    /**
     * Test that an admin can delete a role.
     *
     * @return void
     */
    public function test_admin_can_delete_role()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a role to delete
        $role = Role::create(['name' => 'tester']);

        // Act as the admin and make a DELETE request to delete the role
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->delete("/roles/{$role->id}");

        // Assert that the role was deleted successfully
        $response->assertStatus(204);

        // Verify that the role no longer exists in the database
        $this->assertDatabaseMissing('roles', ['name' => 'tester']);
    }

    /**
     * Test that a developer cannot delete a role.
     *
     * @return void
     */
    public function test_developer_cannot_delete_role()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a role to delete
        $role = Role::create(['name' => 'tester']);

        // Act as the developer and make a DELETE request to delete the role
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->delete("/roles/{$role->id}");

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the role still exists in the database
        $this->assertDatabaseHas('roles', ['name' => 'tester']);
    }
}
