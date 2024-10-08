<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\TaskList;
use App\Models\Board;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
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
     * Test that an admin can create a task list.
     *
     * @return void
     */
    public function test_admin_can_create_task_list()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a board
        $board = Board::factory()->create();

        // Define task list data
        $taskListData = [
            'name' => 'New Task List',
            'board_id' => $board->id, // Include board_id
        ];

        // Act as the admin and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->postJson('/task-lists', $taskListData);

        // Assert that the task list was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Task List created successfully.',
                'taskList' => [
                    'name' => 'New Task List',
                    'board_id' => $board->id,
                ],
            ]);

        // Verify that the task list exists in the database
        $this->assertDatabaseHas('task_lists', [
            'name' => 'New Task List',
            'board_id' => $board->id,
        ]);
    }

    /**
     * Test that a developer can create a task list.
     *
     * @return void
     */
    public function test_developer_can_create_task_list()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a board
        $board = Board::factory()->create();

        // Define task list data
        $taskListData = [
            'name' => 'Developer Task List',
            'board_id' => $board->id, // Include board_id
        ];

        // Act as the developer and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->postJson('/task-lists', $taskListData);

        // Assert that the task list was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Task List created successfully.',
                'taskList' => [
                    'name' => 'Developer Task List',
                    'board_id' => $board->id,
                ],
            ]);

        // Verify that the task list exists in the database
        $this->assertDatabaseHas('task_lists', [
            'name' => 'Developer Task List',
            'board_id' => $board->id,
        ]);
    }

    /**
     * Test that a client cannot create a task list.
     *
     * @return void
     */
    public function test_client_cannot_create_task_list()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a board
        $board = Board::factory()->create();

        // Define task list data
        $taskListData = [
            'name' => 'Unauthorized Task List',
            'board_id' => $board->id, // Include board_id
        ];

        // Act as the client and attempt to create a task list
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->postJson('/task-lists', $taskListData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the task list does not exist in the database
        $this->assertDatabaseMissing('task_lists', [
            'name' => 'Unauthorized Task List',
            'board_id' => $board->id,
        ]);
    }

    /**
     * Test that an admin can update any task list.
     *
     * @return void
     */
    public function test_admin_can_update_any_task_list()
    {
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a board
        $board = Board::factory()->create();

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Initial Task List',
            'board_id' => $board->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Task List',
            'board_id' => $board->id, // Include board_id
        ];

        // Act as the admin and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->putJson("/task-lists/{$taskList->id}", $updatedData);

        // Assert that the task list was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Task List updated successfully.',
                'taskList' => [
                    'id' => $taskList->id,
                    'name' => 'Updated Task List',
                    'board_id' => $board->id,
                ],
            ]);

        // Verify that the task list was updated in the database
        $this->assertDatabaseHas('task_lists', [
            'id' => $taskList->id,
            'name' => 'Updated Task List',
            'board_id' => $board->id,
        ]);
    }

    /**
     * Test that a developer can update any task list.
     *
     * @return void
     */
    public function test_developer_can_update_any_task_list()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a board
        $board = Board::factory()->create();

        // Create a task list with an associated board
        $taskList = TaskList::factory()->create([
            'name' => 'Initial Developer Task List',
            'board_id' => $board->id,
        ]);

        // Define updated data, including the board_id
        $updatedData = [
            'name' => 'Updated Developer Task List',
            'board_id' => $board->id,
        ];

        // Act as the developer and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->putJson("/task-lists/{$taskList->id}", $updatedData);

        // Assert that the task list was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Task List updated successfully.',
                'taskList' => [
                    'id' => $taskList->id,
                    'name' => 'Updated Developer Task List',
                    'board_id' => $board->id,
                ],
            ]);

        // Verify that the task list was updated in the database
        $this->assertDatabaseHas('task_lists', [
            'id' => $taskList->id,
            'name' => 'Updated Developer Task List',
            'board_id' => $board->id,
        ]);
    }

    /**
     * Test that a client cannot update a task list.
     *
     * @return void
     */
    public function test_client_cannot_update_task_list()
    {
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        $board = Board::factory()->create();

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Client Task List',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Attempted Update by Client',
            'board_id' => $board->id,
        ];

        // Act as the client and attempt to update the task list
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->putJson("/task-lists/{$taskList->id}", $updatedData);

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
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Task List to Delete',
        ]);

        // Act as the admin and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->deleteJson("/task-lists/{$taskList->id}");

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
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Developer Task List to Delete',
        ]);

        // Act as the developer and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->deleteJson("/task-lists/{$taskList->id}");

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
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Client Task List to Delete',
        ]);

        // Act as the client and attempt to delete the task list
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/task-lists/{$taskList->id}");

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
        // Create an admin user with API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Specific Admin Task List',
        ]);

        // Act as the admin and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson("/task-lists/{$taskList->id}");

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
        // Create a client user with API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a task list
        $taskList = TaskList::factory()->create([
            'name' => 'Client Attempting to View Task List',
        ]);

        // Act as the client and attempt to view the task list
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson("/task-lists/{$taskList->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that any authenticated user can view all task lists.
     *
     * @return void
     */
    public function test_authenticated_user_can_view_all_task_lists()
    {
        // Create a developer user with API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create task lists
        $taskLists = TaskList::factory()->count(2)->create();

        // Act as the developer and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->getJson('/task-lists');

        // Assert that the response is successful and contains the task lists
        $response->assertStatus(200)
            ->assertJsonCount(2); // Assuming the response is a JSON array

        // You can also add more assertions to check the structure
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
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
