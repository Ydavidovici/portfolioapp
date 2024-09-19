<?php

namespace Tests\Feature\Controllers;

use App\Models\Note;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoteControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_notes()
    {
        $user = User::factory()->create();
        Note::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/notes');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_note()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $data = [
            'content' => 'New Note',
            'user_id' => $user->id,
            'project_id' => $project->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/notes', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Note created successfully.']);
    }

    public function test_can_update_note()
    {
        $user = User::factory()->create();
        $note = Note::factory()->create(['content' => 'Old Note']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/notes/{$note->id}", [
            'content' => 'Updated Note',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Note updated successfully.']);
    }

    public function test_can_delete_note()
    {
        $user = User::factory()->create();
        $note = Note::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/notes/{$note->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Note deleted successfully.']);
    }
}
