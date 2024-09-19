<?php

namespace Tests\Feature\Controllers;

use App\Models\TaskList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskListControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_task_lists()
    {
        TaskList::factory()->count(3)->create();

        $response = $this->getJson('/api/tasklists');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_task_list()
    {
        $data = ['name' => 'New Task List'];

        $response = $this->postJson('/api/tasklists', $data);

        $response->assertStatus(201)
            ->assertJson(['name' => 'New Task List']);
    }

    public function test_can_update_task_list()
    {
        $taskList = TaskList::factory()->create(['name' => 'Old Task List']);

        $response = $this->putJson("/api/tasklists/{$taskList->id}", [
            'name' => 'Updated Task List',
        ]);

        $response->assertStatus(200)
            ->assertJson(['name' => 'Updated Task List']);
    }

    public function test_can_delete_task_list()
    {
        $taskList = TaskList::factory()->create();

        $response = $this->deleteJson("/api/tasklists/{$taskList->id}");

        $response->assertStatus(204);
    }
}
