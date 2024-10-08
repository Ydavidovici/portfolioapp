<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
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
     * Test that an admin can create a project.
     */
    public function test_admin_can_create_project()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Define project data including required fields
        $projectData = [
            'name' => 'New Project',
            'description' => 'Project description',
            'status' => 'active', // or 'completed', 'archived' based on your enum
            'start_date' => '2023-01-01',
            'end_date' => '2023-12-31', // Optional if nullable
            'client_id' => $client->id,
        ];

        // Make a POST request to create a project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->postJson('/projects', $projectData);

        // Assert that the project was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Project created successfully.',
                'project' => [
                    'name' => 'New Project',
                    'client_id' => $client->id,
                    'status' => 'active',
                    'start_date' => '2023-01-01',
                ],
            ]);

        // Verify that the project exists in the database
        $this->assertDatabaseHas('projects', [
            'name' => 'New Project',
            'client_id' => $client->id,
            'status' => 'active',
            'start_date' => '2023-01-01',
        ]);
    }

    /**
     * Test that a developer can create a project.
     */
    public function test_developer_can_create_project()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Define project data including required fields
        $projectData = [
            'name' => 'Developer Project',
            'description' => 'Developer project description',
            'status' => 'active',
            'start_date' => '2023-02-01',
            'client_id' => $client->id,
        ];

        // Make a POST request to create a project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->postJson('/projects', $projectData);

        // Assert that the project was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Project created successfully.',
                'project' => [
                    'name' => 'Developer Project',
                    'client_id' => $client->id,
                    'status' => 'active',
                    'start_date' => '2023-02-01',
                ],
            ]);

        // Verify that the project exists in the database
        $this->assertDatabaseHas('projects', [
            'name' => 'Developer Project',
            'client_id' => $client->id,
            'status' => 'active',
            'start_date' => '2023-02-01',
        ]);
    }

    /**
     * Test that a client cannot create a project.
     */
    public function test_client_cannot_create_project()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Define project data including required fields
        $projectData = [
            'name' => 'Unauthorized Project',
            'description' => 'Project description',
            'status' => 'active',
            'start_date' => '2023-01-01',
            'end_date' => '2023-12-31', // Optional if nullable
            'client_id' => $client->id,
        ];

        // Act as the client and make a POST request to create a project
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->postJson('/projects', $projectData);

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
     */
    public function test_admin_can_update_any_project()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Original Project',
            'description' => 'Original description',
            'status' => 'active',
            'start_date' => '2023-01-01',
            'client_id' => $client->id,
        ]);

        // Define updated data including required fields
        $updatedData = [
            'name' => 'Updated Project Name',
            'description' => 'Updated description',
            'status' => 'completed',
            'start_date' => '2023-01-01',
            'client_id' => $client->id,
        ];

        // Make a PUT request to update the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->putJson("/projects/{$project->id}", $updatedData);

        // Assert that the project was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Project updated successfully.',
                'project' => [
                    'id' => $project->id,
                    'name' => 'Updated Project Name',
                    'client_id' => $client->id,
                    'status' => 'completed',
                ],
            ]);

        // Verify that the project was updated in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
            'status' => 'completed',
        ]);
    }

    /**
     * Test that a developer can update any project.
     */
    public function test_developer_can_update_any_project()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Original Developer Project',
            'description' => 'Original description',
            'status' => 'active',
            'start_date' => '2023-02-01',
            'client_id' => $client->id,
        ]);

        // Define updated data including required fields
        $updatedData = [
            'name' => 'Updated Developer Project Name',
            'description' => 'Updated description',
            'status' => 'completed',
            'start_date' => '2023-02-01',
            'client_id' => $client->id,
        ];

        // Make a PUT request to update the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->putJson("/projects/{$project->id}", $updatedData);

        // Assert that the project was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Project updated successfully.',
                'project' => [
                    'id' => $project->id,
                    'name' => 'Updated Developer Project Name',
                    'client_id' => $client->id,
                    'status' => 'completed',
                ],
            ]);

        // Verify that the project was updated in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Developer Project Name',
            'status' => 'completed',
        ]);
    }

    /**
     * Test that a client cannot update a project.
     */
    public function test_client_cannot_update_project()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Client Project',
            'description' => 'Original description',
            'status' => 'active',
            'start_date' => '2023-03-01',
            'client_id' => $client->id,
        ]);

        // Define updated data including required fields
        $updatedData = [
            'name' => 'Attempted Update by Client',
            'description' => 'Updated description',
            'status' => 'completed',
            'start_date' => '2023-03-01',
            'client_id' => $client->id,
        ];

        // Make a PUT request to update the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->putJson("/projects/{$project->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the project was not updated in the database
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Client Project',
            'status' => 'active',
        ]);
    }

    /**
     * Test that an admin can delete any project.
     */
    public function test_admin_can_delete_any_project()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Project to Delete',
            'description' => 'Project to delete',
            'status' => 'active',
            'start_date' => '2023-01-01',
            'client_id' => $client->id,
        ]);

        // Make a DELETE request to delete the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->deleteJson("/projects/{$project->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Project deleted successfully.',
            ]);

        // Verify that the project no longer exists in the database
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    /**
     * Test that a developer can delete any project.
     */
    public function test_developer_can_delete_any_project()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Developer Project to Delete',
            'description' => 'Project to delete',
            'status' => 'active',
            'start_date' => '2023-02-01',
            'client_id' => $client->id,
        ]);

        // Make a DELETE request to delete the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->deleteJson("/projects/{$project->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Project deleted successfully.',
            ]);

        // Verify that the project no longer exists in the database
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    /**
     * Test that a client cannot delete a project.
     */
    public function test_client_cannot_delete_project()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Client Project to Delete',
            'description' => 'Project description',
            'status' => 'active',
            'start_date' => '2023-03-01',
            'client_id' => $client->id,
        ]);

        // Make a DELETE request to delete the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/projects/{$project->id}");

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
     */
    public function test_client_can_view_their_projects()
    {
        // Create two client users with API tokens
        $client1 = $this->createUserWithRoleAndToken('client');
        $client2 = $this->createUserWithRoleAndToken('client');

        // Create projects for client1
        $client1Projects = Project::factory()->count(2)->create([
            'client_id' => $client1->id,
        ]);

        // Create projects for client2
        $client2Projects = Project::factory()->count(2)->create([
            'client_id' => $client2->id,
        ]);

        // Make a GET request to view projects, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client1->plainApiToken,
        ])->getJson('/projects');

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
     */
    public function test_admin_can_view_any_project()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a client to associate with the project
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project
        $project = Project::factory()->create([
            'name' => 'Specific Admin Project',
            'description' => 'Project description',
            'status' => 'active',
            'start_date' => '2023-01-01',
            'client_id' => $client->id,
        ]);

        // Make a GET request to view the project, including the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson("/projects/{$project->id}");

        // Assert that the response is successful and contains the project data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $project->id,
                'name' => 'Specific Admin Project',
                'client_id' => $client->id,
            ]);
    }

    /**
     * Test that a client cannot view another client's project.
     */
    public function test_client_cannot_view_others_project()
    {
        // Create two client users with API tokens
        $client1 = $this->createUserWithRoleAndToken('client');
        $client2 = $this->createUserWithRoleAndToken('client');

        // Create a project for client2
        $project = Project::factory()->create([
            'name' => 'Client2 Project',
            'description' => 'Project description',
            'status' => 'active',
            'start_date' => '2023-01-01',
            'client_id' => $client2->id,
        ]);

        // Act as client1 and attempt to view client2's project
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client1->plainApiToken,
        ])->getJson("/projects/{$project->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access projects.
     */
    public function test_unauthenticated_user_cannot_access_projects()
    {
        // Create projects
        $projects = Project::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/projects');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
