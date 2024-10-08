<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Note;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Illuminate\Support\Str;

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
     * Helper method to assign an API token to a user and get headers.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    protected function getAuthHeaders(User $user)
    {
        // Generate a unique API token
        $apiToken = Str::random(60);
        $hashedToken = hash('sha256', $apiToken);
        $user->api_token = $hashedToken;
        $user->save();

        return [
            'Authorization' => 'Bearer ' . $apiToken,
            'Accept' => 'application/json',
        ];
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
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Define note data
        $noteData = [
            'content' => 'Important admin note.',
            'project_id' => $project->id, // Use the created project's ID
            // Add other necessary fields as per your Note model
        ];

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a POST request to create a note
        $response = $this->withHeaders($headers)->postJson('/notes', $noteData);

        // Assert that the response status is 201 Created
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Note created successfully.',
                'note' => [
                    'content' => 'Important admin note.',
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the note exists in the database
        $this->assertDatabaseHas('notes', [
            'content' => 'Important admin note.',
            'project_id' => $project->id,
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
        $developer = User::factory()->create([
            'password' => Hash::make('developerpassword'),
        ]);
        $developer->roles()->attach($developerRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Define note data
        $noteData = [
            'content' => 'Developer note regarding project.',
            'project_id' => $project->id, // Use the created project's ID
            // Add other necessary fields as per your Note model
        ];

        // Assign an API token to the developer and get headers
        $headers = $this->getAuthHeaders($developer);

        // Act as the developer and make a POST request to create a note
        $response = $this->withHeaders($headers)->postJson('/notes', $noteData);

        // Assert that the response status is 201 Created
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Note created successfully.',
                'note' => [
                    'content' => 'Developer note regarding project.',
                    'project_id' => $project->id,
                ],
            ]);

        // Verify that the note exists in the database
        $this->assertDatabaseHas('notes', [
            'content' => 'Developer note regarding project.',
            'project_id' => $project->id,
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
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Define note data
        $noteData = [
            'content' => 'Client attempting to create a note.',
            'project_id' => $project->id, // Use the created project's ID
            // Add other necessary fields as per your Note model
        ];

        // Assign an API token to the client and get headers
        $headers = $this->getAuthHeaders($client);

        // Act as the client and make a POST request to create a note
        $response = $this->withHeaders($headers)->postJson('/notes', $noteData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Assert that the note was not created in the database
        $this->assertDatabaseMissing('notes', [
            'content' => 'Client attempting to create a note.',
            'project_id' => $project->id,
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
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Original Note Content',
            'project_id' => $project->id,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Updated Note Content by Admin',
        ];

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a PUT request to update the note
        $response = $this->withHeaders($headers)->putJson("/notes/{$note->id}", $updatedData);

        // Assert that the response status is 200 OK
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
        $developer = User::factory()->create([
            'password' => Hash::make('developerpassword'),
        ]);
        $developer->roles()->attach($developerRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Original Developer Note',
            'project_id' => $project->id,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Updated Developer Note Content',
        ];

        // Assign an API token to the developer and get headers
        $headers = $this->getAuthHeaders($developer);

        // Act as the developer and make a PUT request to update the note
        $response = $this->withHeaders($headers)->putJson("/notes/{$note->id}", $updatedData);

        // Assert that the response status is 200 OK
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
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Client Note',
            'project_id' => $project->id,
        ]);

        // Define updated data
        $updatedData = [
            'content' => 'Attempted Update by Client',
        ];

        // Assign an API token to the client and get headers
        $headers = $this->getAuthHeaders($client);

        // Act as the client and make a PUT request to update the note
        $response = $this->withHeaders($headers)->putJson("/notes/{$note->id}", $updatedData);

        // Assert that the response status is 403 Forbidden
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
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Note to Delete',
            'project_id' => $project->id,
        ]);

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a DELETE request to delete the note
        $response = $this->withHeaders($headers)->deleteJson("/notes/{$note->id}");

        // Assert that the response status is 200 OK
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
        $developer = User::factory()->create([
            'password' => Hash::make('developerpassword'),
        ]);
        $developer->roles()->attach($developerRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Developer Note to Delete',
            'project_id' => $project->id,
        ]);

        // Assign an API token to the developer and get headers
        $headers = $this->getAuthHeaders($developer);

        // Act as the developer and make a DELETE request to delete the note
        $response = $this->withHeaders($headers)->deleteJson("/notes/{$note->id}");

        // Assert that the response status is 200 OK
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
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Client Attempting to Delete Note',
            'project_id' => $project->id,
        ]);

        // Define updated data (optional, since we're deleting)
        // $updatedData = [
        //     'content' => 'Attempted Update by Client',
        // ];

        // Assign an API token to the client and get headers
        $headers = $this->getAuthHeaders($client);

        // Act as the client and make a DELETE request to delete the note
        $response = $this->withHeaders($headers)->deleteJson("/notes/{$note->id}");

        // Assert that the response status is 403 Forbidden
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
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Specific Admin Note',
            'project_id' => $project->id,
        ]);

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a GET request to view the note
        $response = $this->withHeaders($headers)->getJson("/notes/{$note->id}");

        // Assert that the response is successful and contains the note data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $note->id,
                'content' => 'Specific Admin Note',
                'project_id' => $project->id,
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
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create a note associated with the project
        $note = Note::factory()->create([
            'content' => 'Client Attempting to View Note',
            'project_id' => $project->id,
        ]);

        // Assign an API token to the client and get headers
        $headers = $this->getAuthHeaders($client);

        // Act as the client and make a GET request to view the note
        $response = $this->withHeaders($headers)->getJson("/notes/{$note->id}");

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
        // Create a project and get its ID
        $project = Project::factory()->create();

        // Create notes associated with the project
        $notes = Note::factory()->count(2)->create([
            'project_id' => $project->id,
        ]);

        // Make a GET request without authentication
        $response = $this->getJson('/notes');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
