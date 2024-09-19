<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_documents()
    {
        $user = User::factory()->create();
        Document::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/documents');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_document()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $data = [
            'name' => 'Document 1',
            'url' => 'https://example.com/doc1.pdf',
            'project_id' => $project->id,
            'uploaded_by' => $user->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/documents', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Document uploaded successfully.']);
    }

    public function test_can_update_document()
    {
        $user = User::factory()->create();
        $document = Document::factory()->create(['name' => 'Old Document']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/documents/{$document->id}", [
            'name' => 'Updated Document',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Document updated successfully.']);
    }

    public function test_can_delete_document()
    {
        $user = User::factory()->create();
        $document = Document::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Document deleted successfully.']);
    }
}
