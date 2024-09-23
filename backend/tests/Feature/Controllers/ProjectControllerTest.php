<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
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
     * Test that an admin can create a project.
     *
     * @return void
     */
    public function test_admin_can_create_project()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define project data
        $projectData = [
            'name' => 'New Project',
            'client_id' => 1, // Ensure a client with ID 1 exists or adjust accordingly
            // Add other necessary fields as per your Project model
        ];

        // Act as the admin and make a POST request to create a project
        $response = $this->actingAs($admin)->postJson('/projects', $projectData);

        // Assert that the project was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Project',
                'client_id' => 1,
            ]);

        // Verify that the project exists in the database
        $this->assertDatabaseHas('projects', [
            'name' => 'New Project',
            'client_id' => 1,
        ]);
    }

    /**
     * Test that a developer can create a project.
     *
     * @return void
     */
    public function test_developer_can_create_project()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define project data
        $projectData = [
            'name' => 'Developer Project',
            'client_id' => 2, // Ensure a client with ID 2 exists or adjust accordingly
            // Add other necessary fields as per your Project model
        ];

        // Act as the developer and make a POST request to create a project
        $response = $this->actingAs($developer)->postJson('/projects', $projectData);

        // Assert that the project was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Developer Project',
                'client_id' => 2,
            ]);

        // Verify that the project exists in the database
        $this->assertDatabaseHas('projects', [
            'name' => 'Developer Project',
            'client_id' => 2,
        ]);
    }

    /**
     * Test that a client cannot create a project.
     *
     * @return void
     */
    public function test_client_cannot_create_project()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define project data
        $projectData = [
            'name' => 'Unauthorized Project',
            'client_id' => $client->id,
            // Add other necessary fields as per your Project model
        ];

        // Act as the client and make a POST request to create a project
        $response = $this->actingAs($client)->postJson('/projects', $projectData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the project does not exist in the database
        $this->assertDatabaseMissing('projects', [
            'name' => 'Unauthorized Project',
            'client_id' => $client->id,
        ]);
    }

    /**
     * Test that an admin can update any project.
     *
     * @return void
     */
    public function test_admin_can_update_any_project()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Original Project',
            'client_id' => 1,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Project Name',
        ];

        // Act as the admin and make a PUT request to update the project
        $response = $this->actingAs($admin)->putJson("/projects/{$project->id}", $updatedData);

        // Assert that the project was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Project Name',
                'client_id' => 1,
            ]);

        // Verify that the project was updated in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
        ]);
    }

    /**
     * Test that a developer can update any project.
     *
     * @return void
     */
    public function test_developer_can_update_any_project()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Original Developer Project',
            'client_id' => 2,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Developer Project Name',
        ];

        // Act as the developer and make a PUT request to update the project
        $response = $this->actingAs($developer)->putJson("/projects/{$project->id}", $updatedData);

        // Assert that the project was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Developer Project Name',
                'client_id' => 2,
            ]);

        // Verify that the project was updated in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Developer Project Name',
        ]);
    }

    /**
     * Test that a client cannot update a project.
     *
     * @return void
     */
    public function test_client_cannot_update_project()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Client Project',
            'client_id' => $client->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Attempted Update by Client',
        ];

        // Act as the client and make a PUT request to update the project
        $response = $this->actingAs($client)->putJson("/projects/{$project->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the project was not updated in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Client Project',
        ]);
    }

    /**
     * Test that an admin can delete any project.
     *
     * @return void
     */
    public function test_admin_can_delete_any_project()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Project to Delete',
            'client_id' => 1,
        ]);

        // Act as the admin and make a DELETE request to delete the project
        $response = $this->actingAs($admin)->deleteJson("/projects/{$project->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the project no longer exists in the database
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    /**
     * Test that a developer can delete any project.
     *
     * @return void
     */
    public function test_developer_can_delete_any_project()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Developer Project to Delete',
            'client_id' => 2,
        ]);

        // Act as the developer and make a DELETE request to delete the project
        $response = $this->actingAs($developer)->deleteJson("/projects/{$project->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the project no longer exists in the database
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    /**
     * Test that a client cannot delete a project.
     *
     * @return void
     */
    public function test_client_cannot_delete_project()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Client Project to Delete',
            'client_id' => $client->id,
        ]);

        // Act as the client and make a DELETE request to delete the project
        $response = $this->actingAs($client)->deleteJson("/projects/{$project->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the project still exists in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Client Project to Delete',
        ]);
    }

    /**
     * Test that a client can view their own projects.
     *
     * @return void
     */
    public function test_client_can_view_their_projects()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create();
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create();
        $client2->roles()->attach($clientRole);

        // Create projects for client1
        $client1Projects = Project::factory()->count(2)->create([
            'client_id' => $client1->id,
        ]);

        // Create projects for client2
        $client2Projects = Project::factory()->count(2)->create([
            'client_id' => $client2->id,
        ]);

        // Act as client1 and make a GET request to view projects
        $response = $this->actingAs($client1)->getJson('/projects');

        // Assert that the response contains only client1's projects
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($client1Projects as $project) {
            $response->assertJsonFragment([
                'id' => $project->id,
                'name' => $project->name,
                'client_id' => $client1->id,
            ]);
        }

        // Ensure that client2's projects are not visible
        foreach ($client2Projects as $project) {
            $response->assertJsonMissing([
                'id' => $project->id,
                'name' => $project->name,
            ]);
        }
    }

    /**
     * Test that an admin can view any project.
     *
     * @return void
     */
    public function test_admin_can_view_any_project()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Specific Admin Project',
            'client_id' => 1,
        ]);

        // Act as the admin and make a GET request to view the project
        $response = $this->actingAs($admin)->getJson("/projects/{$project->id}");

        // Assert that the response is successful and contains the project data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $project->id,
                'name' => 'Specific Admin Project',
                'client_id' => 1,
            ]);
    }

    /**
     * Test that a client cannot view another client's project.
     *
     * @return void
     */
    public function test_client_cannot_view_others_project()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create();
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create();
        $client2->roles()->attach($clientRole);

        // Create a project for client2
        $project = Project::factory()->create([
            'name' => 'Client2 Project',
            'client_id' => $client2->id,
        ]);

        // Act as client1 and attempt to view client2's project
        $response = $this->actingAs($client1)->getJson("/projects/{$project->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access projects.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_projects()
    {
        // Create projects
        $projects = Project::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/projects');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
