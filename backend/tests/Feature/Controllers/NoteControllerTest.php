<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Note;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoteControllerTest extends TestCase
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
     * Test that an admin can create a note.
     *
     * @return void
     */
    public function test_admin_can_create_note()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define note data
        $noteData = [
            'content' => 'Important admin note.',
            'project_id' => 1, // Ensure a project with ID 1 exists or adjust accordingly
            // Add other necessary fields as per your Note model
        ];

        // Act as the admin and make a POST request to create a note
        $response = $this->actingAs($admin)->postJson('/notes', $noteData);

        // Assert that the note was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Note created successfully.',
                'note' => [
                    'content' => 'Important admin note.',
                    'project_id' => 1,
                ],
            ]);

        // Verify that the note exists in the database
        $this->assertDatabaseHas('notes', [
            'content' => 'Important admin note.',
            'project_id' => 1,
        ]);
    }

    /**
     * Test that a developer can create a note.
     *
     * @return void
     */
    public function test_developer_can_create_note()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define note data
        $noteData = [
            'content' => 'Developer note regarding project.',
            'project_id' => 2, // Ensure a project with ID 2 exists or adjust accordingly
            // Add other necessary fields as per your Note model
        ];

        // Act as the developer and make a POST request to create a note
        $response = $this->actingAs($developer)->postJson('/notes', $noteData);

        // Assert that the note was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Note created successfully.',
                'note' => [
                    'content' => 'Developer note regarding project.',
                    'project_id' => 2,
                ],
            ]);

        // Verify that the note exists in the database
        $this->assertDatabaseHas('notes', [
            'content' => 'Developer note regarding project.',
            'project_id' => 2,
        ]);
    }

    /**
     * Test that a client cannot create a note.
     *
     * @return void
     */
    public function test_client_cannot_create_note()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define note data
        $noteData = [
            'content' => 'Client attempting to create a note.',
            'project_id' => 3, // Ensure a project with ID 3 exists or adjust accordingly
            // Add other necessary fields as per your Note model
        ];

        // Act as the client and make a POST request to create a note
        $response = $this->actingAs($client)->postJson('/notes', $noteData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the note does not exist in the database
        $this->assertDatabaseMissing('notes', [
            'content' => 'Client attempting to create a note.',
            'project_id' => 3,
        ]);
    }

    /**
     * Test that an admin can update any note.
     *
     * @return void
     */
    public function test_admin_can_update_any_note()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Original Note Content',
            'project_id' => 1,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Updated Note Content by Admin',
        ];

        // Act as the admin and make a PUT request to update the note
        $response = $this->actingAs($admin)->putJson("/notes/{$note->id}", $updatedData);

        // Assert that the note was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Note updated successfully.',
                'note' => [
                    'id' => $note->id,
                    'content' => 'Updated Note Content by Admin',
                ],
            ]);

        // Verify that the note was updated in the database
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'content' => 'Updated Note Content by Admin',
        ]);
    }

    /**
     * Test that a developer can update any note.
     *
     * @return void
     */
    public function test_developer_can_update_any_note()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Original Developer Note',
            'project_id' => 2,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Updated Developer Note Content',
        ];

        // Act as the developer and make a PUT request to update the note
        $response = $this->actingAs($developer)->putJson("/notes/{$note->id}", $updatedData);

        // Assert that the note was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Note updated successfully.',
                'note' => [
                    'id' => $note->id,
                    'content' => 'Updated Developer Note Content',
                ],
            ]);

        // Verify that the note was updated in the database
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'content' => 'Updated Developer Note Content',
        ]);
    }

    /**
     * Test that a client cannot update a note.
     *
     * @return void
     */
    public function test_client_cannot_update_note()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Client Note',
            'project_id' => 3,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Attempted Update by Client',
        ];

        // Act as the client and make a PUT request to update the note
        $response = $this->actingAs($client)->putJson("/notes/{$note->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the note was not updated in the database
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'content' => 'Client Note',
        ]);
    }

    /**
     * Test that an admin can delete any note.
     *
     * @return void
     */
    public function test_admin_can_delete_any_note()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Note to Delete',
            'project_id' => 1,
        ]);

        // Act as the admin and make a DELETE request to delete the note
        $response = $this->actingAs($admin)->deleteJson("/notes/{$note->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Note deleted successfully.',
            ]);

        // Verify that the note no longer exists in the database
        $this->assertDatabaseMissing('notes', [
            'id' => $note->id,
        ]);
    }

    /**
     * Test that a developer can delete any note.
     *
     * @return void
     */
    public function test_developer_can_delete_any_note()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Developer Note to Delete',
            'project_id' => 2,
        ]);

        // Act as the developer and make a DELETE request to delete the note
        $response = $this->actingAs($developer)->deleteJson("/notes/{$note->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Note deleted successfully.',
            ]);

        // Verify that the note no longer exists in the database
        $this->assertDatabaseMissing('notes', [
            'id' => $note->id,
        ]);
    }

    /**
     * Test that a client cannot delete a note.
     *
     * @return void
     */
    public function test_client_cannot_delete_note()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Client Attempting to Delete Note',
            'project_id' => 3,
        ]);

        // Act as the client and make a DELETE request to delete the note
        $response = $this->actingAs($client)->deleteJson("/notes/{$note->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the note still exists in the database
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'content' => 'Client Attempting to Delete Note',
        ]);
    }

    /**
     * Test that an admin can view any note.
     *
     * @return void
     */
    public function test_admin_can_view_any_note()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Specific Admin Note',
            'project_id' => 1,
        ]);

        // Act as the admin and make a GET request to view the note
        $response = $this->actingAs($admin)->getJson("/notes/{$note->id}");

        // Assert that the response is successful and contains the note data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $note->id,
                'content' => 'Specific Admin Note',
                'project_id' => 1,
            ]);
    }

    /**
     * Test that a client cannot view notes.
     *
     * @return void
     */
    public function test_client_cannot_view_notes()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a note
        $note = Note::factory()->create([
            'content' => 'Client Attempting to View Note',
            'project_id' => 3,
        ]);

        // Act as the client and make a GET request to view the note
        $response = $this->actingAs($client)->getJson("/notes/{$note->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access notes.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_notes()
    {
        // Create notes
        $notes = Note::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/notes');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
