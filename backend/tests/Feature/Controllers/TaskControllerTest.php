<?php

namespace Tests\Feature\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_tasks()
    {
        Task::factory()->count(3)->create();

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_task()
    {
        $user = User::factory()->create();
        $data = [
            'title' => 'New Task',
            'status' => 'to-do',
            'assigned_to' => $user->id,
        ];

        $response = $this->postJson('/api/tasks', $data);

        $response->assertStatus(201)
            ->assertJson(['title' => 'New Task']);
    }

    public function test_can_update_task()
    {
        $task = Task::factory()->create(['title' => 'Old Task']);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Updated Task',
        ]);

        $response->assertStatus(200)
            ->assertJson(['title' => 'Updated Task']);
    }

    public function test_can_delete_task()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(204);
    }
}
