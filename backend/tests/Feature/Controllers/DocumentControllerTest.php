<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Document;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
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
     * Test that an admin can create a document.
     *
     * @return void
     */
    public function test_admin_can_create_document()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define document data
        $documentData = [
            'title' => 'New Document',
            'project_id' => 1, // Ensure a project with ID 1 exists or adjust accordingly
            // Add other necessary fields as per your Document model
        ];

        // Act as the admin and make a POST request to create a document
        $response = $this->actingAs($admin)->postJson('/documents', $documentData);

        // Assert that the document was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Document uploaded successfully.',
                'document' => [
                    'title' => 'New Document',
                    'project_id' => 1,
                ],
            ]);

        // Verify that the document exists in the database
        $this->assertDatabaseHas('documents', [
            'title' => 'New Document',
            'project_id' => 1,
        ]);
    }

    /**
     * Test that a client can create a document.
     *
     * @return void
     */
    public function test_client_can_create_document()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define document data
        $documentData = [
            'title' => 'Client Document',
            'project_id' => 2, // Ensure a project with ID 2 exists or adjust accordingly
            // Add other necessary fields as per your Document model
        ];

        // Act as the client and make a POST request to create a document
        $response = $this->actingAs($client)->postJson('/documents', $documentData);

        // Assert that the document was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Document uploaded successfully.',
                'document' => [
                    'title' => 'Client Document',
                    'project_id' => 2,
                ],
            ]);

        // Verify that the document exists in the database
        $this->assertDatabaseHas('documents', [
            'title' => 'Client Document',
            'project_id' => 2,
            'uploaded_by' => $client->id,
        ]);
    }

    /**
     * Test that a developer cannot create a document.
     *
     * @return void
     */
    public function test_developer_cannot_create_document()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define document data
        $documentData = [
            'title' => 'Developer Document',
            'project_id' => 3, // Ensure a project with ID 3 exists or adjust accordingly
            // Add other necessary fields as per your Document model
        ];

        // Act as the developer and make a POST request to create a document
        $response = $this->actingAs($developer)->postJson('/documents', $documentData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the document does not exist in the database
        $this->assertDatabaseMissing('documents', [
            'title' => 'Developer Document',
            'project_id' => 3,
        ]);
    }

    /**
     * Test that an admin can view all documents.
     *
     * @return void
     */
    public function test_admin_can_view_all_documents()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create documents
        $documents = Document::factory()->count(3)->create();

        // Act as the admin and make a GET request to view all documents
        $response = $this->actingAs($admin)->getJson('/documents');

        // Assert that the response is successful and contains all documents
        $response->assertStatus(200)
            ->assertJsonCount(3);

        foreach ($documents as $document) {
            $response->assertJsonFragment([
                'id' => $document->id,
                'title' => $document->title,
                'project_id' => $document->project_id,
                'uploaded_by' => $document->uploaded_by,
            ]);
        }
    }

    /**
     * Test that a client can view their own documents.
     *
     * @return void
     */
    public function test_client_can_view_their_own_documents()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create documents for the client
        $clientDocuments = Document::factory()->count(2)->create([
            'uploaded_by' => $client->id,
        ]);

        // Create documents for another user
        $otherDocuments = Document::factory()->count(2)->create();

        // Act as the client and make a GET request to view their documents
        $response = $this->actingAs($client)->getJson('/documents');

        // Assert that the response contains only the client's documents
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($clientDocuments as $doc) {
            $response->assertJsonFragment([
                'id' => $doc->id,
                'title' => $doc->title,
                'project_id' => $doc->project_id,
                'uploaded_by' => $doc->uploaded_by,
            ]);
        }

        // Ensure that other documents are not visible
        foreach ($otherDocuments as $doc) {
            $response->assertJsonMissing([
                'id' => $doc->id,
                'title' => $doc->title,
            ]);
        }
    }

    /**
     * Test that a client cannot view others' documents.
     *
     * @return void
     */
    public function test_client_cannot_view_others_documents()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create documents for another user
        $otherDocuments = Document::factory()->count(2)->create();

        // Act as the client and make a GET request to view documents
        $response = $this->actingAs($client)->getJson('/documents');

        // Assert that the response does not contain other users' documents
        foreach ($otherDocuments as $doc) {
            $response->assertJsonMissing([
                'id' => $doc->id,
                'title' => $doc->title,
            ]);
        }
    }

    /**
     * Test that a client can update their own document.
     *
     * @return void
     */
    public function test_client_can_update_their_own_document()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a document for the client
        $document = Document::factory()->create([
            'title' => 'Client Document',
            'uploaded_by' => $client->id,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Client Document',
            // Add other fields if necessary
        ];

        // Act as the client and make a PUT request to update the document
        $response = $this->actingAs($client)->putJson("/documents/{$document->id}", $updatedData);

        // Assert that the document was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document updated successfully.',
                'document' => [
                    'id' => $document->id,
                    'title' => 'Updated Client Document',
                ],
            ]);

        // Verify that the document was updated in the database
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'title' => 'Updated Client Document',
        ]);
    }

    /**
     * Test that a client cannot update others' documents.
     *
     * @return void
     */
    public function test_client_cannot_update_others_documents()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a document for another user
        $otherDocument = Document::factory()->create();

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update',
        ];

        // Act as the client and make a PUT request to update the other user's document
        $response = $this->actingAs($client)->putJson("/documents/{$otherDocument->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the document was not updated in the database
        $this->assertDatabaseHas('documents', [
            'id' => $otherDocument->id,
            'title' => $otherDocument->title,
        ]);
    }

    /**
     * Test that a client can delete their own document.
     *
     * @return void
     */
    public function test_client_can_delete_their_own_document()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a document for the client
        $document = Document::factory()->create([
            'title' => 'Client Document to Delete',
            'uploaded_by' => $client->id,
        ]);

        // Act as the client and make a DELETE request to delete the document
        $response = $this->actingAs($client)->deleteJson("/documents/{$document->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document deleted successfully.',
            ]);

        // Verify that the document no longer exists in the database
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);
    }

    /**
     * Test that a client cannot delete others' documents.
     *
     * @return void
     */
    public function test_client_cannot_delete_others_documents()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a document for another user
        $otherDocument = Document::factory()->create();

        // Act as the client and make a DELETE request to delete the other user's document
        $response = $this->actingAs($client)->deleteJson("/documents/{$otherDocument->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the document still exists in the database
        $this->assertDatabaseHas('documents', [
            'id' => $otherDocument->id,
            'title' => $otherDocument->title,
        ]);
    }

    /**
     * Test that an admin can view a specific document.
     *
     * @return void
     */
    public function test_admin_can_view_specific_document()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a document
        $document = Document::factory()->create([
            'title' => 'Specific Document',
        ]);

        // Act as the admin and make a GET request to view the document
        $response = $this->actingAs($admin)->getJson("/documents/{$document->id}");

        // Assert that the response is successful and contains the document data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $document->id,
                'title' => 'Specific Document',
                'project_id' => $document->project_id,
                'uploaded_by' => $document->uploaded_by,
            ]);
    }

    /**
     * Test that a client can view their own document.
     *
     * @return void
     */
    public function test_client_can_view_their_own_document()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a document for the client
        $document = Document::factory()->create([
            'title' => 'Client Document to View',
            'uploaded_by' => $client->id,
        ]);

        // Act as the client and make a GET request to view the document
        $response = $this->actingAs($client)->getJson("/documents/{$document->id}");

        // Assert that the response is successful and contains the document data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $document->id,
                'title' => 'Client Document to View',
                'project_id' => $document->project_id,
                'uploaded_by' => $document->uploaded_by,
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access documents.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_documents()
    {
        // Create documents
        $documents = Document::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/documents');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
