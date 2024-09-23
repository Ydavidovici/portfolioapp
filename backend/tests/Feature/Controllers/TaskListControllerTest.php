<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\TaskList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskListControllerTest extends TestCase
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
     * Test that an admin can create a task list.
     *
     * @return void
     */
    public function test_admin_can_create_task_list()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define task list data
        $taskListData = [
            'name' => 'New Task List',
            // Add other necessary fields as per your TaskList model
        ];

        // Act as the admin and make a POST request to create a task list
        $response = $this->actingAs($admin)->postJson('/task-lists', $taskListData);

        // Assert that the task list was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Task List',
            ]);

        // Verify that the task list exists in the database
        $this->assertDatabaseHas('task_lists', [
            'name' => 'New Task List',
        ]);
    }

    /**
     * Test that a developer can create a task list.
     *
     * @return void
     */
    public function test_developer_can_create_task_list()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define task list data
        $taskListData = [
            'name' => 'Developer Task List',
            // Add other necessary fields as per your TaskList model
        ];

        // Act as the developer and make a POST request to create a task list
        $response = $this->actingAs($developer)->postJson('/task-lists', $taskListData);

        // Assert that the task list was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Developer Task List',
            ]);

        // Verify that the task list exists in the database
        $this->assertDatabaseHas('task_lists', [
            'name' => 'Developer Task List',
        ]);
    }

    /**
     * Test that a client cannot create a task list.
     *
     * @return void
     */
    public function test_client_cannot_create_task_list()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define task list data
        $taskListData = [
            'name' => 'Unauthorized Task List',
            // Add other necessary fields as per your TaskList model
        ];

        // Act as the client and attempt to create a task list
        $response = $this->actingAs($client)->postJson('/task-lists', $taskListData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task list does not exist in the database
        $this->assertDatabaseMissing('task_lists', [
            'name' => 'Unauthorized Task List',
        ]);
    }

    /**
     * Test that an admin can update any task list.
     *
     * @return void
     */
    public function test_admin_can_update_any_task_list()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Initial Task List',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Task List',
        ];

        // Act as the admin and make a PUT request to update the task list
        $response = $this->actingAs($admin)->putJson("/task-lists/{$taskList->id}", $updatedData);

        // Assert that the task list was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Task List',
            ]);

        // Verify that the task list was updated in the database
        $this->assertDatabaseHas('task_lists', [
            'id' => $taskList->id,
            'name' => 'Updated Task List',
        ]);
    }

    /**
     * Test that a developer can update any task list.
     *
     * @return void
     */
    public function test_developer_can_update_any_task_list()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Initial Developer Task List',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Developer Task List',
        ];

        // Act as the developer and make a PUT request to update the task list
        $response = $this->actingAs($developer)->putJson("/task-lists/{$taskList->id}", $updatedData);

        // Assert that the task list was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Developer Task List',
            ]);

        // Verify that the task list was updated in the database
        $this->assertDatabaseHas('task_lists', [
            'id' => $taskList->id,
            'name' => 'Updated Developer Task List',
        ]);
    }

    /**
     * Test that a client cannot update a task list.
     *
     * @return void
     */
    public function test_client_cannot_update_task_list()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Client Task List',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Attempted Update by Client',
        ];

        // Act as the client and attempt to update the task list
        $response = $this->actingAs($client)->putJson("/task-lists/{$taskList->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task list was not updated in the database
        $this->assertDatabaseHas('task_lists', [
            'id' => $taskList->id,
            'name' => 'Client Task List',
        ]);
    }

    /**
     * Test that an admin can delete any task list.
     *
     * @return void
     */
    public function test_admin_can_delete_any_task_list()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Task List to Delete',
        ]);

        // Act as the admin and make a DELETE request to delete the task list
        $response = $this->actingAs($admin)->deleteJson("/task-lists/{$taskList->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the task list no longer exists in the database
        $this->assertDatabaseMissing('task_lists', [
            'id' => $taskList->id,
            'name' => 'Task List to Delete',
        ]);
    }

    /**
     * Test that a developer can delete any task list.
     *
     * @return void
     */
    public function test_developer_can_delete_any_task_list()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Developer Task List to Delete',
        ]);

        // Act as the developer and make a DELETE request to delete the task list
        $response = $this->actingAs($developer)->deleteJson("/task-lists/{$taskList->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the task list no longer exists in the database
        $this->assertDatabaseMissing('task_lists', [
            'id' => $taskList->id,
            'name' => 'Developer Task List to Delete',
        ]);
    }

    /**
     * Test that a client cannot delete a task list.
     *
     * @return void
     */
    public function test_client_cannot_delete_task_list()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Client Task List to Delete',
        ]);

        // Act as the client and attempt to delete the task list
        $response = $this->actingAs($client)->deleteJson("/task-lists/{$taskList->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task list still exists in the database
        $this->assertDatabaseHas('task_lists', [
            'id' => $taskList->id,
            'name' => 'Client Task List to Delete',
        ]);
    }

    /**
     * Test that an admin can view any task list.
     *
     * @return void
     */
    public function test_admin_can_view_any_task_list()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Specific Admin Task List',
        ]);

        // Act as the admin and make a GET request to view the task list
        $response = $this->actingAs($admin)->getJson("/task-lists/{$taskList->id}");

        // Assert that the response is successful and contains the task list data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $taskList->id,
                'name' => 'Specific Admin Task List',
            ]);
    }

    /**
     * Test that a client cannot view any task list.
     *
     * @return void
     */
    public function test_client_cannot_view_any_task_list()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Client Attempting to View Task List',
        ]);

        // Act as the client and attempt to view the task list
        $response = $this->actingAs($client)->getJson("/task-lists/{$taskList->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access task lists.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_task_lists()
    {
        // Create task lists
        $taskLists = TaskList::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/task-lists');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
