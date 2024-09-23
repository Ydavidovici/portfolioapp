<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Reminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

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
     * Test that an admin can create a reminder.
     *
     * @return void
     */
    public function test_admin_can_create_reminder()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define reminder data
        $reminderData = [
            'title' => 'Project Deadline',
            'description' => 'Complete the project by end of the month.',
            // Add other necessary fields as per your Reminder model
        ];

        // Act as the admin and make a POST request to create a reminder
        $response = $this->actingAs($admin)->postJson('/reminders', $reminderData);

        // Assert that the reminder was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Project Deadline',
                'description' => 'Complete the project by end of the month.',
            ]);

        // Verify that the reminder exists in the database
        $this->assertDatabaseHas('reminders', [
            'title' => 'Project Deadline',
            'description' => 'Complete the project by end of the month.',
        ]);
    }

    /**
     * Test that a developer can create a reminder.
     *
     * @return void
     */
    public function test_developer_can_create_reminder()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define reminder data
        $reminderData = [
            'title' => 'Code Review',
            'description' => 'Review the new feature implementation.',
            // Add other necessary fields as per your Reminder model
        ];

        // Act as the developer and make a POST request to create a reminder
        $response = $this->actingAs($developer)->postJson('/reminders', $reminderData);

        // Assert that the reminder was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Code Review',
                'description' => 'Review the new feature implementation.',
            ]);

        // Verify that the reminder exists in the database
        $this->assertDatabaseHas('reminders', [
            'title' => 'Code Review',
            'description' => 'Review the new feature implementation.',
        ]);
    }

    /**
     * Test that a client cannot create a reminder.
     *
     * @return void
     */
    public function test_client_cannot_create_reminder()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define reminder data
        $reminderData = [
            'title' => 'Unauthorized Reminder',
            'description' => 'Client attempting to create a reminder.',
            // Add other necessary fields as per your Reminder model
        ];

        // Act as the client and attempt to create a reminder
        $response = $this->actingAs($client)->postJson('/reminders', $reminderData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the reminder does not exist in the database
        $this->assertDatabaseMissing('reminders', [
            'title' => 'Unauthorized Reminder',
            'description' => 'Client attempting to create a reminder.',
        ]);
    }

    /**
     * Test that an admin can view all reminders.
     *
     * @return void
     */
    public function test_admin_can_view_all_reminders()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create reminders
        $reminders = Reminder::factory()->count(3)->create();

        // Act as the admin and make a GET request to view reminders
        $response = $this->actingAs($admin)->getJson('/reminders');

        // Assert that the response is successful and contains all reminders
        $response->assertStatus(200)
            ->assertJsonCount(3);

        foreach ($reminders as $reminder) {
            $response->assertJsonFragment([
                'id' => $reminder->id,
                'title' => $reminder->title,
                'description' => $reminder->description,
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
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create reminders
        $reminders = Reminder::factory()->count(2)->create();

        // Act as the developer and make a GET request to view reminders
        $response = $this->actingAs($developer)->getJson('/reminders');

        // Assert that the response is successful and contains all reminders
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($reminders as $reminder) {
            $response->assertJsonFragment([
                'id' => $reminder->id,
                'title' => $reminder->title,
                'description' => $reminder->description,
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
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create reminders
        $reminders = Reminder::factory()->count(2)->create();

        // Act as the client and attempt to view reminders
        $response = $this->actingAs($client)->getJson('/reminders');

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
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'title' => 'Initial Reminder',
            'description' => 'Initial Description',
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Reminder',
            'description' => 'Updated Description',
        ];

        // Act as the admin and make a PUT request to update the reminder
        $response = $this->actingAs($admin)->putJson("/reminders/{$reminder->id}", $updatedData);

        // Assert that the reminder was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reminder updated successfully.',
                'reminder' => [
                    'id' => $reminder->id,
                    'title' => 'Updated Reminder',
                    'description' => 'Updated Description',
                ],
            ]);

        // Verify that the reminder was updated in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'title' => 'Updated Reminder',
            'description' => 'Updated Description',
        ]);
    }

    /**
     * Test that a developer can update a reminder.
     *
     * @return void
     */
    public function test_developer_can_update_reminder()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'title' => 'Developer Reminder',
            'description' => 'Developer Description',
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Developer Updated Reminder',
            'description' => 'Developer Updated Description',
        ];

        // Act as the developer and make a PUT request to update the reminder
        $response = $this->actingAs($developer)->putJson("/reminders/{$reminder->id}", $updatedData);

        // Assert that the reminder was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reminder updated successfully.',
                'reminder' => [
                    'id' => $reminder->id,
                    'title' => 'Developer Updated Reminder',
                    'description' => 'Developer Updated Description',
                ],
            ]);

        // Verify that the reminder was updated in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'title' => 'Developer Updated Reminder',
            'description' => 'Developer Updated Description',
        ]);
    }

    /**
     * Test that a client cannot update a reminder.
     *
     * @return void
     */
    public function test_client_cannot_update_reminder()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'title' => 'Client Reminder',
            'description' => 'Client Description',
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Client Attempted Update',
            'description' => 'Client Attempted Description',
        ];

        // Act as the client and attempt to update the reminder
        $response = $this->actingAs($client)->putJson("/reminders/{$reminder->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the reminder was not updated in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'title' => 'Client Reminder',
            'description' => 'Client Description',
        ]);
    }

    /**
     * Test that an admin can delete a reminder.
     *
     * @return void
     */
    public function test_admin_can_delete_reminder()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'title' => 'Reminder to Delete',
            'description' => 'Description to Delete',
        ]);

        // Act as the admin and make a DELETE request to delete the reminder
        $response = $this->actingAs($admin)->deleteJson("/reminders/{$reminder->id}");

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
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'title' => 'Developer Reminder to Delete',
            'description' => 'Developer Description to Delete',
        ]);

        // Act as the developer and make a DELETE request to delete the reminder
        $response = $this->actingAs($developer)->deleteJson("/reminders/{$reminder->id}");

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
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a reminder
        $reminder = Reminder::factory()->create([
            'title' => 'Client Reminder to Delete',
            'description' => 'Client Description to Delete',
        ]);

        // Act as the client and attempt to delete the reminder
        $response = $this->actingAs($client)->deleteJson("/reminders/{$reminder->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the reminder still exists in the database
        $this->assertDatabaseHas('reminders', [
            'id' => $reminder->id,
            'title' => 'Client Reminder to Delete',
            'description' => 'Client Description to Delete',
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
        $response->assertStatus(401);
    }
}
