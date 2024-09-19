<?php

namespace Tests\Feature\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_projects()
    {
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_project()
    {
        $client = User::factory()->create();

        $data = [
            'name' => 'New Project',
            'description' => 'A new project description',
            'status' => 'active',
            'start_date' => now(),
            'client_id' => $client->id,
        ];

        $response = $this->postJson('/api/projects', $data);

        $response->assertStatus(201)
            ->assertJson(['name' => 'New Project']);
    }

    public function test_can_update_project()
    {
        $project = Project::factory()->create(['name' => 'Old Project']);

        $response = $this->putJson("/api/projects/{$project->id}", [
            'name' => 'Updated Project',
        ]);

        $response->assertStatus(200)
            ->assertJson(['name' => 'Updated Project']);
    }

    public function test_can_delete_project()
    {
        $project = Project::factory()->create();

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(204);
    }
}
