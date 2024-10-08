<?php

namespace Tests\Feature\Controllers;

use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class TaskControllerTest extends TestCase
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
     * Test that an admin can create a task.
     *
     * @return void
     */
    public function test_admin_can_create_task()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Ensure a task list exists
        $taskList = TaskList::factory()->create();

        // Ensure a project exists
        $project = Project::factory()->create();

        // Define task data with valid status
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description.',
            'status' => 'to-do', // Valid status value
            'task_list_id' => $taskList->id,
            'assigned_to' => $admin->id,
            'project_id' => $project->id, // Include the project_id
        ];

        // Act as the admin and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->postJson('/tasks', $taskData);

        // Assert that the task was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Task created successfully.',
                'task' => [
                    'title' => 'New Task',
                    'description' => 'Task description.',
                    'status' => 'to-do',
                    'task_list_id' => $taskList->id,
                    'assigned_to' => $admin->id,
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the task exists in the database
        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'description' => 'Task description.',
            'status' => 'to-do',
            'task_list_id' => $taskList->id,
            'assigned_to' => $admin->id,
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a developer can create a task.
     *
     * @return void
     */
    public function test_developer_can_create_task()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Ensure a task list exists
        $taskList = TaskList::factory()->create();

        // Ensure a project exists
        $project = Project::factory()->create();

        // Define task data with valid status
        $taskData = [
            'title' => 'Developer Task',
            'description' => 'Developer task description.',
            'status' => 'in-progress', // Valid status value
            'task_list_id' => $taskList->id,
            'assigned_to' => $developer->id,
            'project_id' => $project->id,
        ];

        // Act as the developer and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->postJson('/tasks', $taskData);

        // Assert that the task was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Task created successfully.',
                'task' => [
                    'title' => 'Developer Task',
                    'description' => 'Developer task description.',
                    'status' => 'in-progress',
                    'task_list_id' => $taskList->id,
                    'assigned_to' => $developer->id,
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the task exists in the database
        $this->assertDatabaseHas('tasks', [
            'title' => 'Developer Task',
            'description' => 'Developer task description.',
            'status' => 'in-progress',
            'task_list_id' => $taskList->id,
            'assigned_to' => $developer->id,
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a client cannot create a task.
     *
     * @return void
     */
    public function test_client_cannot_create_task()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Ensure a task list exists
        $taskList = TaskList::factory()->create();

        // Ensure a project exists
        $project = Project::factory()->create();

        // Define task data with valid status
        $taskData = [
            'title' => 'Unauthorized Task',
            'description' => 'Client should not be able to create this.',
            'status' => 'to-do', // Valid status value
            'task_list_id' => $taskList->id,
            'assigned_to' => $client->id,
            'project_id' => $project->id,
        ];

        // Act as the client and attempt to create a task
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->postJson('/tasks', $taskData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task does not exist in the database
        $this->assertDatabaseMissing('tasks', [
            'title' => 'Unauthorized Task',
            'description' => 'Client should not be able to create this.',
            'status' => 'to-do',
            'task_list_id' => $taskList->id,
            'assigned_to' => $client->id,
            'project_id' => $project->id,
        ]);
    }

    public function test_admin_can_update_any_task()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Ensure a task list exists
        $taskList = TaskList::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Initial Task',
            'description' => 'Initial description.',
            'status' => 'to-do',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id,
        ]);

        // Define updated data with valid status
        $updatedData = [
            'title' => 'Updated Task Title',
            'description' => 'Updated task description.',
            'status' => 'done', // Valid status value
            'project_id' => $project->id,
            'task_list_id' => $taskList->id, // Include task_list_id
        ];

        // Act as the admin and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->putJson("/tasks/{$task->id}", $updatedData);

        // Assert that the task was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Task updated successfully.',
                'task' => [
                    'id' => $task->id,
                    'title' => 'Updated Task Title',
                    'description' => 'Updated task description.',
                    'status' => 'done',
                    'project_id' => $project->id,
                    'task_list_id' => $taskList->id,
                ],
            ]);

        // Verify that the task was updated in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task Title',
            'description' => 'Updated task description.',
            'status' => 'done',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id,
        ]);
    }

    public function test_developer_can_update_any_task()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Ensure a task list exists
        $taskList = TaskList::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Initial Developer Task',
            'description' => 'Initial developer description.',
            'status' => 'to-do',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id,
        ]);

        // Define updated data with valid status
        $updatedData = [
            'title' => 'Updated Developer Task Title',
            'description' => 'Updated developer task description.',
            'status' => 'in-progress',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id, // Include task_list_id
        ];

        // Act as the developer and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->putJson("/tasks/{$task->id}", $updatedData);

        // Assert that the task was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Task updated successfully.',
                'task' => [
                    'id' => $task->id,
                    'title' => 'Updated Developer Task Title',
                    'description' => 'Updated developer task description.',
                    'status' => 'in-progress',
                    'project_id' => $project->id,
                    'task_list_id' => $taskList->id,
                ],
            ]);

        // Verify that the task was updated in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Developer Task Title',
            'description' => 'Updated developer task description.',
            'status' => 'in-progress',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id,
        ]);
    }

    public function test_client_cannot_update_task()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Ensure a task list exists
        $taskList = TaskList::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Client Task',
            'description' => 'Client task description.',
            'status' => 'to-do',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id,
        ]);

        // Define updated data with valid status
        $updatedData = [
            'title' => 'Attempted Update by Client',
            'description' => 'Attempted task description update.',
            'status' => 'done',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id, // Include task_list_id
        ];

        // Act as the client and attempt to update the task
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->putJson("/tasks/{$task->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task was not updated in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Client Task',
            'description' => 'Client task description.',
            'status' => 'to-do',
            'project_id' => $project->id,
            'task_list_id' => $taskList->id,
        ]);
    }

    /**
     * Test that an admin can delete any task.
     *
     * @return void
     */
    public function test_admin_can_delete_any_task()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Task to Delete',
            'description' => 'Description to delete.',
            'status' => 'to-do',
            'project_id' => $project->id,
        ]);

        // Act as the admin and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->deleteJson("/tasks/{$task->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the task no longer exists in the database
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
            'title' => 'Task to Delete',
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a developer can delete any task.
     *
     * @return void
     */
    public function test_developer_can_delete_any_task()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Developer Task to Delete',
            'description' => 'Developer description to delete.',
            'status' => 'to-do',
            'project_id' => $project->id,
        ]);

        // Act as the developer and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->deleteJson("/tasks/{$task->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the task no longer exists in the database
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
            'title' => 'Developer Task to Delete',
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a client cannot delete a task.
     *
     * @return void
     */
    public function test_client_cannot_delete_task()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Client Task to Delete',
            'description' => 'Client description to delete.',
            'status' => 'to-do',
            'project_id' => $project->id,
        ]);

        // Act as the client and attempt to delete the task
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/tasks/{$task->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task still exists in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Client Task to Delete',
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that an admin can view any task.
     *
     * @return void
     */
    public function test_admin_can_view_any_task()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Specific Admin Task',
            'description' => 'Specific admin task description.',
            'status' => 'in-progress',
            'project_id' => $project->id,
        ]);

        // Act as the admin and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson("/tasks/{$task->id}");

        // Assert that the response is successful and contains the task data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $task->id,
                'title' => 'Specific Admin Task',
                'description' => 'Specific admin task description.',
                'status' => 'in-progress',
                'project_id' => $project->id,
            ]);
    }

    /**
     * Test that a client cannot view any task.
     *
     * @return void
     */
    public function test_client_cannot_view_any_task()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Ensure a project exists
        $project = Project::factory()->create();

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Client Attempting to View Task',
            'description' => 'Client task description.',
            'status' => 'done',
            'project_id' => $project->id,
        ]);

        // Act as the client and attempt to view the task
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson("/tasks/{$task->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access tasks.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_tasks()
    {
        // Ensure a project exists
        $project = Project::factory()->create();

        // Create tasks
        $tasks = Task::factory()->count(2)->create([
            'project_id' => $project->id,
        ]);

        // Make a GET request without authentication
        $response = $this->getJson('/tasks');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
