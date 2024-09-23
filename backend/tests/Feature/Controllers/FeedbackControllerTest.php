<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Feedback;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
     * Test that an admin can submit feedback.
     *
     * @return void
     */
    public function test_admin_can_submit_feedback()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define feedback data
        $feedbackData = [
            'content' => 'This is admin feedback.',
            'project_id' => 1, // Ensure a project with ID 1 exists or adjust accordingly
            // Add other necessary fields as per your Feedback model
        ];

        // Act as the admin and make a POST request to submit feedback
        $response = $this->actingAs($admin)->postJson('/feedback', $feedbackData);

        // Assert that the feedback was submitted successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Feedback submitted successfully.',
                'feedback' => [
                    'content' => 'This is admin feedback.',
                    'project_id' => 1,
                ],
            ]);

        // Verify that the feedback exists in the database
        $this->assertDatabaseHas('feedback', [
            'content' => 'This is admin feedback.',
            'project_id' => 1,
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
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define feedback data
        $feedbackData = [
            'content' => 'This is client feedback.',
            'project_id' => 2, // Ensure a project with ID 2 exists or adjust accordingly
            // Add other necessary fields as per your Feedback model
        ];

        // Act as the client and make a POST request to submit feedback
        $response = $this->actingAs($client)->postJson('/feedback', $feedbackData);

        // Assert that the feedback was submitted successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Feedback submitted successfully.',
                'feedback' => [
                    'content' => 'This is client feedback.',
                    'project_id' => 2,
                ],
            ]);

        // Verify that the feedback exists in the database
        $this->assertDatabaseHas('feedback', [
            'content' => 'This is client feedback.',
            'project_id' => 2,
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
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define feedback data
        $feedbackData = [
            'content' => 'This is developer feedback.',
            'project_id' => 3, // Ensure a project with ID 3 exists or adjust accordingly
            // Add other necessary fields as per your Feedback model
        ];

        // Act as the developer and make a POST request to submit feedback
        $response = $this->actingAs($developer)->postJson('/feedback', $feedbackData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the feedback does not exist in the database
        $this->assertDatabaseMissing('feedback', [
            'content' => 'This is developer feedback.',
            'project_id' => 3,
        ]);
    }

    /**
     * Test that an admin can view all feedback.
     *
     * @return void
     */
    public function test_admin_can_view_all_feedback()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create feedback entries
        $feedbackEntries = Feedback::factory()->count(3)->create();

        // Act as the admin and make a GET request to view all feedback
        $response = $this->actingAs($admin)->getJson('/feedback');

        // Assert that the response is successful and contains all feedback
        $response->assertStatus(200)
            ->assertJsonCount(3);

        foreach ($feedbackEntries as $feedback) {
            $response->assertJsonFragment([
                'id' => $feedback->id,
                'content' => $feedback->content,
                'project_id' => $feedback->project_id,
                'submitted_by' => $feedback->submitted_by,
            ]);
        }
    }

    /**
     * Test that a client can view their own feedback.
     *
     * @return void
     */
    public function test_client_can_view_their_own_feedback()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create feedback entries for the client
        $clientFeedback = Feedback::factory()->count(2)->create([
            'submitted_by' => $client->id,
        ]);

        // Create feedback entries for another user
        $otherFeedback = Feedback::factory()->count(2)->create();

        // Act as the client and make a GET request to view their feedback
        $response = $this->actingAs($client)->getJson('/feedback');

        // Assert that the response contains only the client's feedback
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($clientFeedback as $feedback) {
            $response->assertJsonFragment([
                'id' => $feedback->id,
                'content' => $feedback->content,
                'project_id' => $feedback->project_id,
                'submitted_by' => $feedback->submitted_by,
            ]);
        }

        // Ensure that other feedback entries are not visible
        foreach ($otherFeedback as $feedback) {
            $response->assertJsonMissing([
                'id' => $feedback->id,
                'content' => $feedback->content,
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
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create feedback entries for another user
        $otherFeedback = Feedback::factory()->count(2)->create();

        // Act as the client and make a GET request to view feedback
        $response = $this->actingAs($client)->getJson("/feedback/{$otherFeedback->first()->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that a client can update their own feedback.
     *
     * @return void
     */
    public function test_client_can_update_their_own_feedback()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create feedback for the client
        $feedback = Feedback::factory()->create([
            'content' => 'Original Feedback',
            'submitted_by' => $client->id,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Updated Feedback',
        ];

        // Act as the client and make a PUT request to update the feedback
        $response = $this->actingAs($client)->putJson("/feedback/{$feedback->id}", $updatedData);

        // Assert that the feedback was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Feedback updated successfully.',
                'feedback' => [
                    'id' => $feedback->id,
                    'content' => 'Updated Feedback',
                ],
            ]);

        // Verify that the feedback was updated in the database
        $this->assertDatabaseHas('feedback', [
            'id' => $feedback->id,
            'content' => 'Updated Feedback',
        ]);
    }

    /**
     * Test that a client cannot update others' feedback.
     *
     * @return void
     */
    public function test_client_cannot_update_others_feedback()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create feedback for another user
        $otherFeedback = Feedback::factory()->create();

        // Define updated data
        $updatedData = [
            'content' => 'Attempted Update',
        ];

        // Act as the client and make a PUT request to update the other user's feedback
        $response = $this->actingAs($client)->putJson("/feedback/{$otherFeedback->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the feedback was not updated in the database
        $this->assertDatabaseHas('feedback', [
            'id' => $otherFeedback->id,
            'content' => $otherFeedback->content,
        ]);
    }

    /**
     * Test that an admin can delete a feedback entry.
     *
     * @return void
     */
    public function test_admin_can_delete_feedback()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a feedback entry
        $feedback = Feedback::factory()->create([
            'title' => 'Feedback to Delete',
        ]);

        // Act as the admin and make a DELETE request to delete the feedback
        $response = $this->actingAs($admin)->deleteJson("/feedback/{$feedback->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Feedback deleted successfully.',
            ]);

        // Verify that the feedback no longer exists in the database
        $this->assertDatabaseMissing('feedback', [
            'id' => $feedback->id,
        ]);
    }

    /**
     * Test that a client can delete their own feedback.
     *
     * @return void
     */
    public function test_client_can_delete_their_own_feedback()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a feedback entry for the client
        $feedback = Feedback::factory()->create([
            'title' => 'Client Feedback to Delete',
            'submitted_by' => $client->id,
        ]);

        // Act as the client and make a DELETE request to delete the feedback
        $response = $this->actingAs($client)->deleteJson("/feedback/{$feedback->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Feedback deleted successfully.',
            ]);

        // Verify that the feedback no longer exists in the database
        $this->assertDatabaseMissing('feedback', [
            'id' => $feedback->id,
        ]);
    }

    /**
     * Test that a client cannot delete others' feedback.
     *
     * @return void
     */
    public function test_client_cannot_delete_others_feedback()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a feedback entry for another user
        $otherFeedback = Feedback::factory()->create();

        // Act as the client and make a DELETE request to delete the other user's feedback
        $response = $this->actingAs($client)->deleteJson("/feedback/{$otherFeedback->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the feedback still exists in the database
        $this->assertDatabaseHas('feedback', [
            'id' => $otherFeedback->id,
            'title' => $otherFeedback->title,
        ]);
    }

    /**
     * Test that any authenticated user can view feedback.
     *
     * @return void
     */
    public function test_any_authenticated_user_can_view_feedback()
    {
        // Retrieve roles
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

        // Create feedback entries
        $feedbackEntries = Feedback::factory()->count(3)->create();

        // Test for each user
        foreach ([$admin, $developer, $client] as $user) {
            $response = $this->actingAs($user)->getJson('/feedback');

            if ($user->hasRole('admin')) {
                // Admins can view all feedback
                $response->assertStatus(200)
                    ->assertJsonCount(3);
            } elseif ($user->hasRole('client')) {
                // Clients can view only their own feedback
                $clientFeedback = Feedback::where('submitted_by', $user->id)->count();
                $response->assertStatus(200)
                    ->assertJsonCount($clientFeedback);
            } else {
                // Other roles (if any) cannot view feedback
                $response->assertStatus(403);
            }
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
        $response->assertStatus(401);
    }
}
