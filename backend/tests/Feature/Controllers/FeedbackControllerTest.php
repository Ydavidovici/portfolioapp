<?php

namespace Tests\Feature\Controllers;

use App\Models\Feedback;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedbackControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_feedback()
    {
        $user = User::factory()->create();
        Feedback::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/feedback');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_feedback()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $data = [
            'content' => 'Great job!',
            'rating' => 5,
            'project_id' => $project->id,
            'submitted_by' => $user->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/feedback', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Feedback submitted successfully.']);
    }

    public function test_can_update_feedback()
    {
        $user = User::factory()->create();
        $feedback = Feedback::factory()->create(['content' => 'Needs improvement']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/feedback/{$feedback->id}", [
            'content' => 'Updated feedback',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Feedback updated successfully.']);
    }

    public function test_can_delete_feedback()
    {
        $user = User::factory()->create();
        $feedback = Feedback::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/feedback/{$feedback->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Feedback deleted successfully.']);
    }
}
