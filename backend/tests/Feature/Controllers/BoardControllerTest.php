<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Board;
use App\Models\Project; // Ensure that Project model is available
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BoardControllerTest extends TestCase
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
     * Test that an admin can create a board.
     *
     * @return void
     */
    public function test_admin_can_create_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        // Define board data
        $boardData = [
            'name' => 'New Board',
            'project_id' => $project->id,
        ];

        // Act as the admin and make a POST request to create a board
        $response = $this->actingAs($admin)->postJson('/boards', $boardData);

        // Assert that the board was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Board created successfully.',
                'board' => [
                    'name' => 'New Board',
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the board exists in the database
        $this->assertDatabaseHas('boards', [
            'name' => 'New Board',
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a developer can create a board.
     *
     * @return void
     */
    public function test_developer_can_create_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach(Role::where('name', 'developer')->first());

        // Define board data
        $boardData = [
            'name' => 'Developer Board',
            'project_id' => $project->id,
        ];

        // Act as the developer and make a POST request to create a board
        $response = $this->actingAs($developer)->postJson('/boards', $boardData);

        // Assert that the board was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Board created successfully.',
                'board' => [
                    'name' => 'Developer Board',
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the board exists in the database
        $this->assertDatabaseHas('boards', [
            'name' => 'Developer Board',
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a client cannot create a board.
     *
     * @return void
     */
    public function test_client_cannot_create_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach(Role::where('name', 'client')->first());

        // Define board data
        $boardData = [
            'name' => 'Unauthorized Board',
            'project_id' => $project->id,
        ];

        // Act as the client and make a POST request to create a board
        $response = $this->actingAs($client)->postJson('/boards', $boardData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the board does not exist in the database
        $this->assertDatabaseMissing('boards', [
            'name' => 'Unauthorized Board',
        ]);
    }

    /**
     * Test that a developer can update a board.
     *
     * @return void
     */
    public function test_developer_can_update_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach(Role::where('name', 'developer')->first());

        // Create a board
        $board = Board::factory()->create([
            'name' => 'Original Board',
            'project_id' => $project->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Board',
            'project_id' => $project->id,
        ];

        // Act as the developer and make a PUT request to update the board
        $response = $this->actingAs($developer)->putJson("/boards/{$board->id}", $updatedData);

        // Assert that the board was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Board updated successfully.',
                'board' => [
                    'id' => $board->id,
                    'name' => 'Updated Board',
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the board was updated in the database
        $this->assertDatabaseHas('boards', [
            'id' => $board->id,
            'name' => 'Updated Board',
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that a client cannot update a board.
     *
     * @return void
     */
    public function test_client_cannot_update_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach(Role::where('name', 'client')->first());

        // Create a board
        $board = Board::factory()->create([
            'name' => 'Client Board',
            'project_id' => $project->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Attempted Update',
            'project_id' => $project->id,
        ];

        // Act as the client and make a PUT request to update the board
        $response = $this->actingAs($client)->putJson("/boards/{$board->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the board was not updated in the database
        $this->assertDatabaseHas('boards', [
            'id' => $board->id,
            'name' => 'Client Board',
        ]);
    }

    /**
     * Test that an admin can delete a board.
     *
     * @return void
     */
    public function test_admin_can_delete_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        // Create a board
        $board = Board::factory()->create([
            'name' => 'Board to Delete',
            'project_id' => $project->id,
        ]);

        // Act as the admin and make a DELETE request to delete the board
        $response = $this->actingAs($admin)->deleteJson("/boards/{$board->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Board deleted successfully.',
            ]);

        // Verify that the board no longer exists in the database
        $this->assertDatabaseMissing('boards', [
            'id' => $board->id,
        ]);
    }

    /**
     * Test that a client cannot delete a board.
     *
     * @return void
     */
    public function test_client_cannot_delete_board()
    {
        // Create a project to associate with the board
        $project = Project::factory()->create();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach(Role::where('name', 'client')->first());

        // Create a board
        $board = Board::factory()->create([
            'name' => 'Client Board to Delete',
            'project_id' => $project->id,
        ]);

        // Act as the client and make a DELETE request to delete the board
        $response = $this->actingAs($client)->deleteJson("/boards/{$board->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the board still exists in the database
        $this->assertDatabaseHas('boards', [
            'id' => $board->id,
        ]);
    }

    /**
     * Test that any authenticated user can view boards.
     *
     * @return void
     */
    public function test_any_authenticated_user_can_view_boards()
    {
        // Create roles
        $adminRole = Role::where('name', 'admin')->first();
        $developerRole = Role::where('name', 'developer')->first();
        $clientRole = Role::where('name', 'client')->first();

        // Create users
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create boards
        $boards = Board::factory()->count(3)->create();

        // Test for each user
        foreach ([$admin, $developer, $client] as $user) {
            $response = $this->actingAs($user)->getJson('/boards');

            $response->assertStatus(200)
                ->assertJsonCount(3);

            foreach ($boards as $board) {
                $response->assertJsonFragment([
                    'id' => $board->id,
                    'name' => $board->name,
                    'project_id' => $board->project_id,
                ]);
            }
        }
    }

    /**
     * Test that an unauthenticated user cannot view boards.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_view_boards()
    {
        // Create boards
        $boards = Board::factory()->count(3)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/boards');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
