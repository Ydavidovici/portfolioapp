<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Reminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;
use Carbon\Carbon;

class ReminderControllerTest extends TestCase
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
     * Helper method to create a user with a specific role and a unique API token.
     *
     * @param string $roleName
     * @return User
     */
    protected function createUserWithRoleAndToken($roleName)
    {
        $role = Role::where('name', $roleName)->firstOrFail();

        $user = User::factory()->create();
        $user->roles()->attach($role);

        // Generate a unique API token for the user
        $plainToken = Str::random(60);
        $user->api_token = hash('sha256', $plainToken);
        $user->save();

        // Store the plain token for use in the test
        $user->plainApiToken = $plainToken;

        return $user;
    }

    /**
     * Test that an admin can create a reminder.
     *
     * @return void
     */
    public function test_admin_can_create_reminder()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Define reminder data
        $reminderData = [
            'name' => 'Project Reminder',
            'content' => 'Complete the project by end of the month.',
            'due_date' => '2024-11-30',
        ];

        // Act as the admin and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->postJson('/reminders', $reminderData);

        // Assert that the reminder was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Reminder created successfully.',
                'reminder' => [
                    'name' => 'Project Reminder',
                    'content' => 'Complete the project by end of the month.',
                    'due_date' => '2024-11-30',
                    'user_id' => $admin->id,
                ],
            ]);

        // Verify that the reminder exists in the database
        $this->assertDatabaseHas('reminders', [
            'name' => 'Project Reminder',
            'content' => 'Complete the project by end of the month.',
            'due_date' => '2024-11-30',
            'user_id' => $admin->id,
        ]);
    }

    /**
     * Test that a developer can create a reminder.
     *
     * @return void
     */
    public function test_developer_can_create_reminder()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Define reminder data
        $reminderData = [
            'name' => 'Code Review Reminder',
            'content' => 'Review the new feature implementation.',
            'due_date' => '2024-12-05',
        ];

        // Act as the developer and make a POST request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->postJson('/reminders', $reminderData);

        // Assert that the reminder was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Reminder created successfully.',
                'reminder' => [
                    'name' => 'Code Review Reminder',
                    'content' => 'Review the new feature implementation.',
                    'due_date' => '2024-12-05',
                    'user_id' => $developer->id,
                ],
            ]);

        // Verify that the reminder exists in the database
        $this->assertDatabaseHas('reminders', [
            'name' => 'Code Review Reminder',
            'content' => 'Review the new feature implementation.',
            'due_date' => '2024-12-05',
            'user_id' => $developer->id,
        ]);
    }

    /**
     * Test that a client cannot create a reminder.
     *
     * @return void
     */
    public function test_client_cannot_create_reminder()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Define reminder data
        $reminderData = [
            'name' => 'Unauthorized Reminder',
            'content' => 'Client attempting to create a reminder.',
            'due_date' => '2024-12-15',
        ];

        // Act as the client and attempt to create a reminder
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->postJson('/reminders', $reminderData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the reminder does not exist in the database
        $this->assertDatabaseMissing('reminders', [
            'name' => 'Unauthorized Reminder',
            'content' => 'Client attempting to create a reminder.',
            'due_date' => '2024-12-15',
        ]);
    }

    /**
     * Test that an admin can view all reminders.
     *
     * @return void
     */
    public function test_admin_can_view_all_reminders()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create reminders
        $reminders = Reminder::factory()->count(3)->create();

        // Act as the admin and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson('/reminders');

        // Assert that the response is successful and contains all reminders
        $response->assertStatus(200)
            ->assertJsonCount(3);

        foreach ($reminders as $reminder) {
            $dueDate = Carbon::parse($reminder->due_date)->format('Y-m-d');

            $response->assertJsonFragment([
                'id' => $reminder->id,
                'name' => $reminder->name,
                'content' => $reminder->content,
                'due_date' => $dueDate,
            ]);
        }
    }

    /**
     * Test that a developer can view all reminders.
     *
     * @return void
     */
    public function test_developer_can_view_all_reminders()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create reminders
        $reminders = Reminder::factory()->count(2)->create();

        // Act as the developer and make a GET request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->getJson('/reminders');

        // Assert that the response is successful and contains all reminders
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($reminders as $reminder) {
            $dueDate = Carbon::parse($reminder->due_date)->format('Y-m-d');

            $response->assertJsonFragment([
                'id' => $reminder->id,
                'name' => $reminder->name,
                'content' => $reminder->content,
                'due_date' => $dueDate,
            ]);
        }
    }

    /**
     * Test that a client cannot view reminders.
     *
     * @return void
     */
    public function test_client_cannot_view_reminders()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create reminders
        $reminders = Reminder::factory()->count(2)->create();

        // Act as the client and attempt to view reminders
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson('/reminders');

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an admin can update a reminder.
     *
     * @return void
     */
    public function test_admin_can_update_reminder()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'name' => 'Initial Reminder',
            'content' => 'Initial Content',
            'due_date' => '2024-11-15',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Reminder',
            'content' => 'Updated Content',
            'due_date' => '2024-12-01',
        ];

        // Act as the admin and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->putJson("/reminders/{$reminder->id}", $updatedData);

        // Assert that the reminder was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reminder updated successfully.',
                'reminder' => [
                    'id' => $reminder->id,
                    'name' => 'Updated Reminder',
                    'content' => 'Updated Content',
                    'due_date' => '2024-12-01',
                ],
            ]);

        // Verify that the reminder was updated in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'name' => 'Updated Reminder',
            'content' => 'Updated Content',
            'due_date' => '2024-12-01',
        ]);
    }

    /**
     * Test that a developer can update a reminder.
     *
     * @return void
     */
    public function test_developer_can_update_reminder()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'name' => 'Developer Reminder',
            'content' => 'Developer Content',
            'due_date' => '2024-11-20',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Developer Updated Reminder',
            'content' => 'Developer Updated Content',
            'due_date' => '2024-12-05',
        ];

        // Act as the developer and make a PUT request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->putJson("/reminders/{$reminder->id}", $updatedData);

        // Assert that the reminder was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reminder updated successfully.',
                'reminder' => [
                    'id' => $reminder->id,
                    'name' => 'Developer Updated Reminder',
                    'content' => 'Developer Updated Content',
                    'due_date' => '2024-12-05',
                ],
            ]);

        // Verify that the reminder was updated in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'name' => 'Developer Updated Reminder',
            'content' => 'Developer Updated Content',
            'due_date' => '2024-12-05',
        ]);
    }

    /**
     * Test that a client cannot update a reminder.
     *
     * @return void
     */
    public function test_client_cannot_update_reminder()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'name' => 'Client Reminder',
            'content' => 'Client Content',
            'due_date' => '2024-11-25',
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Client Attempted Update',
            'content' => 'Client Attempted Content',
            'due_date' => '2024-12-10',
        ];

        // Act as the client and attempt to update the reminder
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->putJson("/reminders/{$reminder->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the reminder was not updated in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'name' => 'Client Reminder',
            'content' => 'Client Content',
            'due_date' => '2024-11-25',
        ]);
    }

    /**
     * Test that an admin can delete a reminder.
     *
     * @return void
     */
    public function test_admin_can_delete_reminder()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'name' => 'Reminder to Delete',
            'content' => 'Content to Delete',
            'due_date' => '2024-11-30',
        ]);

        // Act as the admin and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->deleteJson("/reminders/{$reminder->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the reminder no longer exists in the database
        $this->assertDatabaseMissing('reminders', [
            'id' => $reminder->id,
        ]);
    }

    /**
     * Test that a developer can delete a reminder.
     *
     * @return void
     */
    public function test_developer_can_delete_reminder()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'name' => 'Developer Reminder to Delete',
            'content' => 'Developer Content to Delete',
            'due_date' => '2024-12-01',
        ]);

        // Act as the developer and make a DELETE request with API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->deleteJson("/reminders/{$reminder->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the reminder no longer exists in the database
        $this->assertDatabaseMissing('reminders', [
            'id' => $reminder->id,
        ]);
    }

    /**
     * Test that a client cannot delete a reminder.
     *
     * @return void
     */
    public function test_client_cannot_delete_reminder()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'name' => 'Client Reminder to Delete',
            'content' => 'Client Content to Delete',
            'due_date' => '2024-12-05',
        ]);

        // Act as the client and attempt to delete the reminder
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/reminders/{$reminder->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the reminder still exists in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'name' => 'Client Reminder to Delete',
            'content' => 'Client Content to Delete',
            'due_date' => '2024-12-05',
        ]);
    }

    /**
     * Test that an unauthenticated user cannot access reminders.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_reminders()
    {
        // Create reminders
        $reminders = Reminder::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/reminders');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
