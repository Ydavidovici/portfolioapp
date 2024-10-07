<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Feedback;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class FeedbackControllerTest extends TestCase
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
     * Helper method to create a user with a specific role and API token.
     *
     * @param string $roleName
     * @return \App\Models\User
     */
    protected function createUserWithRoleAndToken(string $roleName): User
    {
        // Retrieve the role by name
        $role = Role::where('name', $roleName)->first();

        // Create a user and assign the role
        $user = User::factory()->create();
        $user->roles()->attach($role);

        // Generate and store the API token
        $apiToken = Str::random(80);
        $user->api_token = hash('sha256', $apiToken);
        $user->save();

        // Store the plain token for use in tests
        $user->plainApiToken = $apiToken;

        return $user;
    }

    /**
     * Test that an admin can submit feedback.
     *
     * @return void
     */
    public function test_admin_can_submit_feedback()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a project to associate with the feedback
        $project = Project::factory()->create();

        // Define feedback data with required fields, including 'rating'
        $feedbackData = [
            'content' => 'This is admin feedback.',
            'rating' => 5,
            'project_id' => $project->id,
        ];

        // Make a POST request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
            'Accept' => 'application/json',
        ])->postJson('/feedback', $feedbackData);

        // Assert that the feedback was submitted successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Feedback submitted successfully.',
                'feedback' => [
                    'content' => 'This is admin feedback.',
                    'rating' => 5,
                    'project_id' => $project->id,
                    'submitted_by' => [
                        'id' => $admin->id,
                    ],
                ],
            ]);

        // Verify that the feedback exists in the database
        $this->assertDatabaseHas('feedback', [
            'content' => 'This is admin feedback.',
            'rating' => 5,
            'project_id' => $project->id,
            'submitted_by' => $admin->id,
        ]);
    }

    /**
     * Test that a client can submit feedback.
     *
     * @return void
     */
    public function test_client_can_submit_feedback()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project to associate with the feedback
        $project = Project::factory()->create();

        // Define feedback data with required fields, including 'rating'
        $feedbackData = [
            'content' => 'This is client feedback.',
            'rating' => 4,
            'project_id' => $project->id,
        ];

        // Make a POST request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
            'Accept' => 'application/json',
        ])->postJson('/feedback', $feedbackData);

        // Assert that the feedback was submitted successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Feedback submitted successfully.',
                'feedback' => [
                    'content' => 'This is client feedback.',
                    'rating' => 4,
                    'project_id' => $project->id,
                    'submitted_by' => [
                        'id' => $client->id,
                    ],
                ],
            ]);

        // Verify that the feedback exists in the database
        $this->assertDatabaseHas('feedback', [
            'content' => 'This is client feedback.',
            'rating' => 4,
            'project_id' => $project->id,
            'submitted_by' => $client->id,
        ]);
    }

    /**
     * Test that a developer cannot submit feedback.
     *
     * @return void
     */
    public function test_developer_cannot_submit_feedback()
    {
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a project to associate with the feedback
        $project = Project::factory()->create();

        // Define feedback data with required fields, including 'rating'
        $feedbackData = [
            'content' => 'This is developer feedback.',
            'rating' => 3,
            'project_id' => $project->id,
        ];

        // Make a POST request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
            'Accept' => 'application/json',
        ])->postJson('/feedback', $feedbackData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the feedback does not exist in the database
        $this->assertDatabaseMissing('feedback', [
            'content' => 'This is developer feedback.',
            'rating' => 3,
            'project_id' => $project->id,
        ]);
    }

    /**
     * Test that an admin can view all feedback.
     *
     * @return void
     */
    public function test_admin_can_view_all_feedback()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a project to associate with the feedback
        $project = Project::factory()->create();

        // Create feedback entries
        $feedbackEntries = Feedback::factory()->count(3)->create([
            'project_id' => $project->id,
        ]);

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
            'Accept' => 'application/json',
        ])->getJson('/feedback');

        // Assert that the response is successful and contains all feedback
        $response->assertStatus(200)
            ->assertJsonCount(3);

        $responseData = $response->json();

        foreach ($feedbackEntries as $feedback) {
            $this->assertTrue(
                collect($responseData)->contains(function ($value) use ($feedback) {
                    return $value['id'] === $feedback->id &&
                        $value['content'] === $feedback->content &&
                        $value['rating'] === $feedback->rating &&
                        $value['project_id'] === $feedback->project_id &&
                        isset($value['submitted_by']['id']) &&
                        $value['submitted_by']['id'] === $feedback->submitted_by;
                }),
                "Feedback with ID {$feedback->id} does not exist in the response."
            );
        }
    }

    /**
     * Test that a client can view their own feedback.
     *
     * @return void
     */
    public function test_client_can_view_their_own_feedback()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project to associate with the feedback
        $project = Project::factory()->create();

        // Create feedback entries for the client
        $clientFeedback = Feedback::factory()->count(2)->create([
            'content' => 'Client-specific feedback.',
            'rating' => 4,
            'project_id' => $project->id,
            'submitted_by' => $client->id,
        ]);

        // Create feedback entries for another user
        $otherUser = User::factory()->create();
        $otherFeedback = Feedback::factory()->count(2)->create([
            'content' => 'Other user feedback.',
            'rating' => 3,
            'project_id' => $project->id,
            'submitted_by' => $otherUser->id,
        ]);

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
            'Accept' => 'application/json',
        ])->getJson('/feedback');

        // Assert that the response contains only the client's feedback
        $response->assertStatus(200)
            ->assertJsonCount(2);

        $responseData = $response->json();

        foreach ($clientFeedback as $feedback) {
            $this->assertTrue(
                collect($responseData)->contains(function ($item) use ($feedback, $client) {
                    return $item['id'] === $feedback->id &&
                        $item['content'] === 'Client-specific feedback.' &&
                        $item['rating'] === 4 &&
                        $item['project_id'] === $feedback->project_id &&
                        isset($item['submitted_by']['id']) &&
                        $item['submitted_by']['id'] === $client->id;
                }),
                "Feedback with ID {$feedback->id} does not exist in the response."
            );
        }

        // Ensure that other feedback entries are not visible
        foreach ($otherFeedback as $feedback) {
            $response->assertJsonMissing([
                'id' => $feedback->id,
                'content' => 'Other user feedback.',
            ]);
        }
    }

    /**
     * Test that a client cannot view others' feedback.
     *
     * @return void
     */
    public function test_client_cannot_view_others_feedback()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Create feedback entries for another user
        $otherUser = User::factory()->create();
        $otherFeedback = Feedback::factory()->count(2)->create([
            'content' => 'Other user feedback.',
            'rating' => 3,
            'submitted_by' => $otherUser->id,
        ]);

        // Make a GET request with the API token for each feedback
        foreach ($otherFeedback as $feedback) {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $client->plainApiToken,
                'Accept' => 'application/json',
            ])->getJson("/feedback/{$feedback->id}");

            // Assert that the response is forbidden
            $response->assertStatus(403)
                ->assertJson([
                    'message' => 'This action is unauthorized.',
                ]);
        }
    }

    /**
     * Test that an authenticated user can view feedback.
     *
     * @return void
     */
    public function test_any_authenticated_user_can_view_feedback()
    {
        // Create users with different roles
        $admin = $this->createUserWithRoleAndToken('admin');
        $client = $this->createUserWithRoleAndToken('client');

        // Create a project to associate with feedback
        $project = Project::factory()->create();

        // Create feedback entries for admin
        Feedback::factory()->count(3)->create([
            'content' => 'Admin feedback.',
            'rating' => 4,
            'project_id' => $project->id,
            'submitted_by' => $admin->id,
        ]);

        // Create feedback entries specifically for the client
        $clientFeedback = Feedback::factory()->count(2)->create([
            'content' => 'Client-specific feedback.',
            'rating' => 5,
            'project_id' => $project->id,
            'submitted_by' => $client->id,
        ]);

        // Client should only see their own feedback
        $responseClient = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
            'Accept' => 'application/json',
        ])->getJson('/feedback');

        $responseClient->assertStatus(200)
            ->assertJsonCount(2);

        $responseData = $responseClient->json();

        foreach ($clientFeedback as $feedback) {
            $this->assertTrue(
                collect($responseData)->contains(function ($value) use ($feedback) {
                    return $value['id'] === $feedback->id &&
                        $value['content'] === 'Client-specific feedback.' &&
                        $value['rating'] === 5 &&
                        $value['project_id'] === $feedback->project_id &&
                        isset($value['submitted_by']['id']) &&
                        $value['submitted_by']['id'] === $feedback->submitted_by;
                }),
                "Feedback with ID {$feedback->id} does not exist in the response."
            );
        }
    }

    /**
     * Test that an unauthenticated user cannot access feedback.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_feedback()
    {
        // Create feedback entries
        $feedbackEntries = Feedback::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/feedback');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
