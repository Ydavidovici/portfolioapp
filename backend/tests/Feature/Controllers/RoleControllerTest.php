<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

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
     * Test that an admin can view all roles.
     *
     * @return void
     */
    public function test_admin_can_view_all_roles()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create additional roles
        Role::factory()->count(3)->create();

        // Act as the admin and make a GET request to the roles index
        $response = $this->actingAs($admin, 'sanctum')->get('/api/roles');

        // Assert that the response is successful and contains all roles
        $response->assertStatus(200)
            ->assertJsonCount(4); // 1 admin + 3 additional roles
    }

    /**
     * Test that a developer cannot view roles.
     *
     * @return void
     */
    public function test_developer_cannot_view_roles()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Act as the developer and make a GET request to the roles index
        $response = $this->actingAs($developer, 'sanctum')->get('/api/roles');

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
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Act as the client and make a GET request to the roles index
        $response = $this->actingAs($client, 'sanctum')->get('/api/roles');

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
        $response = $this->get('/api/roles');

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401);
    }

    /**
     * Test that an admin can create a new role.
     *
     * @return void
     */
    public function test_admin_can_create_role()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define role data
        $roleData = [
            'name' => 'tester',
        ];

        // Act as the admin and make a POST request to create a new role
        $response = $this->actingAs($admin, 'sanctum')->post('/api/roles', $roleData);

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
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define role data
        $roleData = [
            'name' => 'tester',
        ];

        // Act as the developer and make a POST request to create a new role
        $response = $this->actingAs($developer, 'sanctum')->post('/api/roles', $roleData);

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
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a role to update
        $role = Role::create(['name' => 'tester']);

        // Define updated role data
        $updatedData = [
            'name' => 'qa-tester',
        ];

        // Act as the admin and make a PUT request to update the role
        $response = $this->actingAs($admin, 'sanctum')->put("/api/roles/{$role->id}", $updatedData);

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
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a role to update
        $role = Role::create(['name' => 'tester']);

        // Define updated role data
        $updatedData = [
            'name' => 'qa-tester',
        ];

        // Act as the developer and make a PUT request to update the role
        $response = $this->actingAs($developer, 'sanctum')->put("/api/roles/{$role->id}", $updatedData);

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
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a role to delete
        $role = Role::create(['name' => 'tester']);

        // Act as the admin and make a DELETE request to delete the role
        $response = $this->actingAs($admin, 'sanctum')->delete("/api/roles/{$role->id}");

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
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a role to delete
        $role = Role::create(['name' => 'tester']);

        // Act as the developer and make a DELETE request to delete the role
        $response = $this->actingAs($developer, 'sanctum')->delete("/api/roles/{$role->id}");

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);

        // Verify that the role still exists in the database
        $this->assertDatabaseHas('roles', ['name' => 'tester']);
    }
}
