<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
     * Test that an admin can create a task.
     *
     * @return void
     */
    public function test_admin_can_create_task()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define task data
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description.',
            'task_list_id' => 1, // Ensure a task list with ID 1 exists or adjust accordingly
            'user_id' => $admin->id, // Assign to admin or another user
            // Add other necessary fields as per your Task model
        ];

        // Act as the admin and make a POST request to create a task
        $response = $this->actingAs($admin)->postJson('/tasks', $taskData);

        // Assert that the task was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'title' => 'New Task',
                'description' => 'Task description.',
                'task_list_id' => 1,
                'user_id' => $admin->id,
            ]);

        // Verify that the task exists in the database
        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'description' => 'Task description.',
            'task_list_id' => 1,
            'user_id' => $admin->id,
        ]);
    }

    /**
     * Test that a developer can create a task.
     *
     * @return void
     */
    public function test_developer_can_create_task()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define task data
        $taskData = [
            'title' => 'Developer Task',
            'description' => 'Developer task description.',
            'task_list_id' => 2, // Ensure a task list with ID 2 exists or adjust accordingly
            'user_id' => $developer->id,
            // Add other necessary fields as per your Task model
        ];

        // Act as the developer and make a POST request to create a task
        $response = $this->actingAs($developer)->postJson('/tasks', $taskData);

        // Assert that the task was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Developer Task',
                'description' => 'Developer task description.',
                'task_list_id' => 2,
                'user_id' => $developer->id,
            ]);

        // Verify that the task exists in the database
        $this->assertDatabaseHas('tasks', [
            'title' => 'Developer Task',
            'description' => 'Developer task description.',
            'task_list_id' => 2,
            'user_id' => $developer->id,
        ]);
    }

    /**
     * Test that a client cannot create a task.
     *
     * @return void
     */
    public function test_client_cannot_create_task()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define task data
        $taskData = [
            'title' => 'Unauthorized Task',
            'description' => 'Client should not be able to create this.',
            'task_list_id' => 3, // Ensure a task list with ID 3 exists or adjust accordingly
            'user_id' => $client->id,
            // Add other necessary fields as per your Task model
        ];

        // Act as the client and attempt to create a task
        $response = $this->actingAs($client)->postJson('/tasks', $taskData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task does not exist in the database
        $this->assertDatabaseMissing('tasks', [
            'title' => 'Unauthorized Task',
            'description' => 'Client should not be able to create this.',
            'task_list_id' => 3,
            'user_id' => $client->id,
        ]);
    }

    /**
     * Test that an admin can update any task.
     *
     * @return void
     */
    public function test_admin_can_update_any_task()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Initial Task',
            'description' => 'Initial description.',
            'task_list_id' => 1,
            'user_id' => $admin->id,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Task Title',
            'description' => 'Updated task description.',
        ];

        // Act as the admin and make a PUT request to update the task
        $response = $this->actingAs($admin)->putJson("/tasks/{$task->id}", $updatedData);

        // Assert that the task was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'title' => 'Updated Task Title',
                'description' => 'Updated task description.',
            ]);

        // Verify that the task was updated in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task Title',
            'description' => 'Updated task description.',
        ]);
    }

    /**
     * Test that a developer can update any task.
     *
     * @return void
     */
    public function test_developer_can_update_any_task()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Initial Developer Task',
            'description' => 'Initial developer description.',
            'task_list_id' => 2,
            'user_id' => $developer->id,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Developer Task Title',
            'description' => 'Updated developer task description.',
        ];

        // Act as the developer and make a PUT request to update the task
        $response = $this->actingAs($developer)->putJson("/tasks/{$task->id}", $updatedData);

        // Assert that the task was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'title' => 'Updated Developer Task Title',
                'description' => 'Updated developer task description.',
            ]);

        // Verify that the task was updated in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Developer Task Title',
            'description' => 'Updated developer task description.',
        ]);
    }

    /**
     * Test that a client cannot update a task.
     *
     * @return void
     */
    public function test_client_cannot_update_task()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Client Task',
            'description' => 'Client task description.',
            'task_list_id' => 3,
            'user_id' => $client->id,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update by Client',
            'description' => 'Attempted task description update.',
        ];

        // Act as the client and attempt to update the task
        $response = $this->actingAs($client)->putJson("/tasks/{$task->id}", $updatedData);

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
        ]);
    }

    /**
     * Test that an admin can delete any task.
     *
     * @return void
     */
    public function test_admin_can_delete_any_task()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Task to Delete',
            'description' => 'Description to delete.',
            'task_list_id' => 1,
            'user_id' => $admin->id,
        ]);

        // Act as the admin and make a DELETE request to delete the task
        $response = $this->actingAs($admin)->deleteJson("/tasks/{$task->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the task no longer exists in the database
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
            'title' => 'Task to Delete',
        ]);
    }

    /**
     * Test that a developer can delete any task.
     *
     * @return void
     */
    public function test_developer_can_delete_any_task()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Developer Task to Delete',
            'description' => 'Developer description to delete.',
            'task_list_id' => 2,
            'user_id' => $developer->id,
        ]);

        // Act as the developer and make a DELETE request to delete the task
        $response = $this->actingAs($developer)->deleteJson("/tasks/{$task->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the task no longer exists in the database
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
            'title' => 'Developer Task to Delete',
        ]);
    }

    /**
     * Test that a client cannot delete a task.
     *
     * @return void
     */
    public function test_client_cannot_delete_task()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Client Task to Delete',
            'description' => 'Client description to delete.',
            'task_list_id' => 3,
            'user_id' => $client->id,
        ]);

        // Act as the client and attempt to delete the task
        $response = $this->actingAs($client)->deleteJson("/tasks/{$task->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task still exists in the database
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Client Task to Delete',
        ]);
    }

    /**
     * Test that an admin can view any task.
     *
     * @return void
     */
    public function test_admin_can_view_any_task()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Specific Admin Task',
            'description' => 'Specific admin task description.',
            'task_list_id' => 1,
            'user_id' => $admin->id,
        ]);

        // Act as the admin and make a GET request to view the task
        $response = $this->actingAs($admin)->getJson("/tasks/{$task->id}");

        // Assert that the response is successful and contains the task data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $task->id,
                'title' => 'Specific Admin Task',
                'description' => 'Specific admin task description.',
                'task_list_id' => 1,
                'user_id' => $admin->id,
            ]);
    }

    /**
     * Test that a client cannot view any task.
     *
     * @return void
     */
    public function test_client_cannot_view_any_task()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a task
        $task = Task::factory()->create([
            'title' => 'Client Attempting to View Task',
            'description' => 'Client task description.',
            'task_list_id' => 3,
            'user_id' => $client->id,
        ]);

        // Act as the client and attempt to view the task
        $response = $this->actingAs($client)->getJson("/tasks/{$task->id}");

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
        // Create tasks
        $tasks = Task::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/tasks');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
