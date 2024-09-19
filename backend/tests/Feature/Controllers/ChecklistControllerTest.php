<?php

namespace Tests\Feature;

use App\Models\Checklist;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChecklistControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_checklists()
    {
        $user = User::factory()->create();
        Checklist::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/checklists');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_checklist()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create();

        $data = [
            'name' => 'New Checklist',
            'task_id' => $task->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/checklists', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Checklist created successfully.']);
    }

    public function test_can_update_checklist()
    {
        $user = User::factory()->create();
        $checklist = Checklist::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/checklists/{$checklist->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Checklist updated successfully.']);
    }

    public function test_can_delete_checklist()
    {
        $user = User::factory()->create();
        $checklist = Checklist::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/checklists/{$checklist->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Checklist deleted successfully.']);
    }
}
