<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\CalendarEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarEntryControllerTest extends TestCase
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
     * Test that an admin can create a calendar entry.
     *
     * @return void
     */
    public function test_admin_can_create_calendar_entry()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define calendar entry data with correct time format
        $entryData = [
            'title' => 'Team Meeting',
            'date' => '2024-12-01',
            'start_time' => '10:00:00', // Time format H:i:s
            'end_time' => '11:00:00',   // Time format H:i:s
            'user_id' => $admin->id,
        ];

        // Act as the admin and make a POST request to create a calendar entry
        $response = $this->actingAs($admin)->postJson('/calendar-entries', $entryData);

        // Assert that the calendar entry was created successfully
        $response->assertStatus(201)
            ->assertJsonFragment([
                'message' => 'Calendar entry created successfully.',
                'calendar_entry' => [
                    'title' => 'Team Meeting',
                    'date' => '2024-12-01',
                    'start_time' => '10:00:00',
                    'end_time' => '11:00:00',
                    'user_id' => $admin->id,
                ],
            ]);

        // Verify that the calendar entry exists in the database
        $this->assertDatabaseHas('calendar_entries', [
            'title' => 'Team Meeting',
            'date' => '2024-12-01', // Database stores date without time
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'user_id' => $admin->id,
        ]);
    }

    /**
     * Test that a developer can create a calendar entry.
     *
     * @return void
     */
    public function test_developer_can_create_calendar_entry()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define calendar entry data with correct time format
        $entryData = [
            'title' => 'Developer Standup',
            'date' => '2024-12-02',
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'user_id' => $developer->id,
        ];

        // Act as the developer and make a POST request to create a calendar entry
        $response = $this->actingAs($developer)->postJson('/calendar-entries', $entryData);

        // Assert that the calendar entry was created successfully
        $response->assertStatus(201)
            ->assertJsonFragment([
                'message' => 'Calendar entry created successfully.',
                'calendar_entry' => [
                    'title' => 'Developer Standup',
                    'date' => '2024-12-02',
                    'start_time' => '09:00:00',
                    'end_time' => '10:00:00',
                    'user_id' => $developer->id,
                ],
            ]);

        // Verify that the calendar entry exists in the database
        $this->assertDatabaseHas('calendar_entries', [
            'title' => 'Developer Standup',
            'date' => '2024-12-02', // Database stores date without time
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'user_id' => $developer->id,
        ]);
    }

    /**
     * Test that a client cannot create a calendar entry.
     *
     * @return void
     */
    public function test_client_cannot_create_calendar_entry()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define calendar entry data with correct time format
        $entryData = [
            'title' => 'Client Meeting',
            'date' => '2024-12-03',
            'start_time' => '14:00:00',
            'end_time' => '15:00:00',
            'user_id' => $client->id,
        ];

        // Act as the client and make a POST request to create a calendar entry
        $response = $this->actingAs($client)->postJson('/calendar-entries', $entryData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJsonFragment([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the calendar entry does not exist in the database
        $this->assertDatabaseMissing('calendar_entries', [
            'title' => 'Client Meeting',
            'date' => '2024-12-03',
            'start_time' => '14:00:00',
            'end_time' => '15:00:00',
            'user_id' => $client->id,
        ]);
    }

    /**
     * Test that a developer can update a calendar entry.
     *
     * @return void
     */
    public function test_developer_can_update_calendar_entry()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a calendar entry
        $entry = CalendarEntry::factory()->create([
            'title' => 'Original Entry',
            'date' => '2024-12-04',
            'start_time' => '12:00:00',
            'end_time' => '13:00:00',
            'user_id' => $developer->id,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Entry',
            'date' => '2024-12-05',
            'start_time' => '14:00:00',
            'end_time' => '15:00:00',
        ];

        // Act as the developer and make a PUT request to update the calendar entry
        $response = $this->actingAs($developer)->putJson("/calendar-entries/{$entry->id}", $updatedData);

        // Assert that the calendar entry was updated successfully
        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Calendar entry updated successfully.',
                'calendar_entry' => [
                    'id' => $entry->id,
                    'title' => 'Updated Entry',
                    'date' => '2024-12-05',
                    'start_time' => '14:00:00',
                    'end_time' => '15:00:00',
                ],
            ]);

        // Verify that the calendar entry was updated in the database
        $this->assertDatabaseHas('calendar_entries', [
            'id' => $entry->id,
            'title' => 'Updated Entry',
            'date' => '2024-12-05',
            'start_time' => '14:00:00',
            'end_time' => '15:00:00',
        ]);
    }

    /**
     * Test that a client cannot update a calendar entry.
     *
     * @return void
     */
    public function test_client_cannot_update_calendar_entry()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a calendar entry
        $entry = CalendarEntry::factory()->create([
            'title' => 'Client Entry',
            'date' => '2024-12-06',
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'user_id' => $client->id,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update',
            'date' => '2024-12-07',
            'start_time' => '11:00:00',
            'end_time' => '12:00:00',
        ];

        // Act as the client and make a PUT request to update the calendar entry
        $response = $this->actingAs($client)->putJson("/calendar-entries/{$entry->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJsonFragment([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the calendar entry was not updated in the database
        $this->assertDatabaseHas('calendar_entries', [
            'id' => $entry->id,
            'title' => 'Client Entry',
            'date' => '2024-12-06',
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
        ]);
    }

    /**
     * Test that an admin can delete a calendar entry.
     *
     * @return void
     */
    public function test_admin_can_delete_calendar_entry()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a calendar entry
        $entry = CalendarEntry::factory()->create([
            'title' => 'Entry to Delete',
            'date' => '2024-12-08',
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'user_id' => $admin->id,
        ]);

        // Act as the admin and make a DELETE request to delete the calendar entry
        $response = $this->actingAs($admin)->deleteJson("/calendar-entries/{$entry->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Calendar entry deleted successfully.',
            ]);

        // Verify that the calendar entry no longer exists in the database
        $this->assertDatabaseMissing('calendar_entries', [
            'id' => $entry->id,
        ]);
    }

    /**
     * Test that any authenticated user can view calendar entries.
     *
     * @return void
     */
    public function test_any_authenticated_user_can_view_calendar_entries()
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

        // Create calendar entries
        $entries = CalendarEntry::factory()->count(3)->create();

        // Test for each user
        foreach ([$admin, $developer, $client] as $user) {
            $response = $this->actingAs($user)->getJson('/calendar-entries');

            $response->assertStatus(200)
                ->assertJsonCount(3)
                ->assertJsonFragment([
                    'title' => 'Team Meeting', // Example fragment
                ]);

            foreach ($entries as $entry) {
                $response->assertJsonFragment([
                    'id' => $entry->id,
                    'title' => $entry->title,
                    'date' => $entry->date->format('Y-m-d'), // Adjusted to match serialized date
                    'start_time' => $entry->start_time,
                    'end_time' => $entry->end_time,
                    'user_id' => $entry->user_id,
                ]);
            }
        }
    }

    /**
     * Test that an unauthenticated user cannot view calendar entries.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_view_calendar_entries()
    {
        // Create calendar entries
        $entries = CalendarEntry::factory()->count(3)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/calendar-entries');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
