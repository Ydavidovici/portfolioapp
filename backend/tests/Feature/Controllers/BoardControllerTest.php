<?php

namespace Tests\Feature;

use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BoardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_boards()
    {
        $user = User::factory()->create();
        Project::factory()->hasBoards(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/boards');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_board()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $data = [
            'name' => 'New Board',
            'project_id' => $project->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/boards', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Board created successfully.']);
    }

    public function test_can_update_board()
    {
        $user = User::factory()->create();
        $board = Board::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/boards/{$board->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Board updated successfully.']);
    }

    public function test_can_delete_board()
    {
        $user = User::factory()->create();
        $board = Board::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/boards/{$board->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Board deleted successfully.']);
    }
}
