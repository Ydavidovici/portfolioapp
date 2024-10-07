<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Project;
use App\Models\Document;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
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
     * Test that an admin can create a document.
     *
     * @return void
     */
    public function test_admin_can_create_document()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Confirm that the user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), 'User does not have admin role.');

        // Create a project to associate with the document
        $project = Project::factory()->create();

        // Define document data with required fields
        $documentData = [
            'name' => 'New Document',
            'project_id' => $project->id,
            'url' => 'https://example.com/document.pdf',
            // 'uploaded_by' is set in the controller
        ];

        // Make a POST request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->postJson('/documents', $documentData);

        // Assert that the document was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Document uploaded successfully.',
                'document' => [
                    'name' => 'New Document',
                    'project_id' => $project->id,
                    'url' => 'https://example.com/document.pdf',
                    'uploaded_by' => $admin->id,
                ],
            ]);

        // Verify that the document exists in the database
        $this->assertDatabaseHas('documents', [
            'name' => 'New Document',
            'project_id' => $project->id,
            'url' => 'https://example.com/document.pdf',
            'uploaded_by' => $admin->id,
        ]);
    }

    /**
     * Test that a developer can create a document.
     *
     * @return void
     */
    public function test_developer_can_create_document()
    {
        $developer = $this->createUserWithRoleAndToken('developer');

        // Confirm that the user has the 'developer' role
        $this->assertTrue($developer->hasRole('developer'), 'User does not have developer role.');

        // Create a project to associate with the document
        $project = Project::factory()->create();

        // Define document data with required fields
        $documentData = [
            'name' => 'Developer Document',
            'project_id' => $project->id,
            'url' => 'https://example.com/developer-document.pdf',
            // 'uploaded_by' is set in the controller
        ];

        // Make a POST request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->postJson('/documents', $documentData);

        // Assert that the document was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Document uploaded successfully.',
                'document' => [
                    'name' => 'Developer Document',
                    'project_id' => $project->id,
                    'url' => 'https://example.com/developer-document.pdf',
                    'uploaded_by' => $developer->id,
                ],
            ]);

        // Verify that the document exists in the database
        $this->assertDatabaseHas('documents', [
            'name' => 'Developer Document',
            'project_id' => $project->id,
            'url' => 'https://example.com/developer-document.pdf',
            'uploaded_by' => $developer->id,
        ]);
    }

    /**
     * Test that a client can create a document.
     *
     * @return void
     */
    public function test_client_can_create_document()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create a project to associate with the document
        $project = Project::factory()->create();

        // Define document data with required fields
        $documentData = [
            'name' => 'Client Document',
            'project_id' => $project->id,
            'url' => 'https://example.com/client-document.pdf',
            // 'uploaded_by' is set in the controller
        ];

        // Make a POST request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->postJson('/documents', $documentData);

        // Assert that the document was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Document uploaded successfully.',
                'document' => [
                    'name' => 'Client Document',
                    'project_id' => $project->id,
                    'url' => 'https://example.com/client-document.pdf',
                    'uploaded_by' => $client->id,
                ],
            ]);

        // Verify that the document exists in the database
        $this->assertDatabaseHas('documents', [
            'name' => 'Client Document',
            'project_id' => $project->id,
            'url' => 'https://example.com/client-document.pdf',
            'uploaded_by' => $client->id,
        ]);
    }

    /**
     * Test that an admin can view all documents.
     *
     * @return void
     */
    public function test_admin_can_view_all_documents()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Confirm that the user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), 'User does not have admin role.');

        // Create multiple documents associated with different projects and users
        $documents = Document::factory()->count(3)->create();

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson('/documents');

        // Assert that the response is successful and contains all documents
        $response->assertStatus(200)
            ->assertJsonCount(3);

        $responseData = $response->json();

        foreach ($documents as $document) {
            $this->assertTrue(
                collect($responseData)->contains(function ($item) use ($document) {
                    return $item['id'] === $document->id &&
                        $item['name'] === $document->name &&
                        $item['project_id'] === $document->project_id &&
                        $item['url'] === $document->url &&
                        isset($item['uploaded_by']['id']) &&
                        $item['uploaded_by']['id'] === $document->uploaded_by;
                }),
                "Failed asserting that the document with id {$document->id} is present in the response."
            );
        }
    }

    /**
     * Test that a developer can view all documents.
     *
     * @return void
     */
    public function test_developer_can_view_all_documents()
    {
        $developer = $this->createUserWithRoleAndToken('developer');

        // Confirm that the user has the 'developer' role
        $this->assertTrue($developer->hasRole('developer'), 'User does not have developer role.');

        // Create multiple documents associated with different projects and users
        $documents = Document::factory()->count(3)->create();

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->getJson('/documents');

        // Assert that the response is successful and contains all documents
        $response->assertStatus(200)
            ->assertJsonCount(3);

        $responseData = $response->json();

        foreach ($documents as $document) {
            $this->assertTrue(
                collect($responseData)->contains(function ($item) use ($document) {
                    return $item['id'] === $document->id &&
                        $item['name'] === $document->name &&
                        $item['project_id'] === $document->project_id &&
                        $item['url'] === $document->url &&
                        isset($item['uploaded_by']['id']) &&
                        $item['uploaded_by']['id'] === $document->uploaded_by;
                }),
                "Failed asserting that the document with id {$document->id} is present in the response."
            );
        }
    }

    /**
     * Test that a client can view their own documents.
     *
     * @return void
     */
    public function test_client_can_view_their_own_documents()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create documents for the client
        $clientDocuments = Document::factory()->count(2)->create([
            'uploaded_by' => $client->id,
        ]);

        // Create documents for another user
        Document::factory()->count(2)->create();

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson('/documents');

        // Assert that the response contains only the client's documents
        $response->assertStatus(200)
            ->assertJsonCount(2);

        $responseData = $response->json();

        foreach ($clientDocuments as $doc) {
            $this->assertTrue(
                collect($responseData)->contains(function ($item) use ($doc) {
                    return $item['id'] === $doc->id &&
                        $item['name'] === $doc->name &&
                        $item['project_id'] === $doc->project_id &&
                        $item['url'] === $doc->url &&
                        isset($item['uploaded_by']['id']) &&
                        $item['uploaded_by']['id'] === $doc->uploaded_by;
                }),
                "Failed asserting that the client's document with id {$doc->id} is present in the response."
            );
        }
    }

    /**
     * Test that a client cannot view others' documents.
     *
     * @return void
     */
    public function test_client_cannot_view_others_documents()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create documents for another user
        $otherDocuments = Document::factory()->count(2)->create();

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson('/documents');

        // Assert that the response does not contain other users' documents
        $responseData = $response->json();

        foreach ($otherDocuments as $doc) {
            $this->assertFalse(
                collect($responseData)->contains(function ($item) use ($doc) {
                    return $item['id'] === $doc->id &&
                        $item['name'] === $doc->name &&
                        $item['project_id'] === $doc->project_id &&
                        $item['url'] === $doc->url &&
                        isset($item['uploaded_by']['id']) &&
                        $item['uploaded_by']['id'] === $doc->uploaded_by;
                }),
                "Failed asserting that the other user's document with id {$doc->id} is not present in the response."
            );
        }
    }

    /**
     * Test that an admin can update a document.
     *
     * @return void
     */
    public function test_admin_can_update_document()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Confirm that the user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), 'User does not have admin role.');

        // Create a document
        $document = Document::factory()->create([
            'name' => 'Original Document',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/original-document.pdf',
            'uploaded_by' => $admin->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Document',
            'project_id' => $document->project_id,
            'url' => 'https://example.com/updated-document.pdf',
        ];

        // Make a PUT request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->putJson("/documents/{$document->id}", $updatedData);

        // Assert that the document was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document updated successfully.',
                'document' => [
                    'id' => $document->id,
                    'name' => 'Updated Document',
                    'project_id' => $document->project_id,
                    'url' => 'https://example.com/updated-document.pdf',
                    'uploaded_by' => $admin->id,
                ],
            ]);

        // Verify that the document was updated in the database
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => 'Updated Document',
            'url' => 'https://example.com/updated-document.pdf',
        ]);
    }

    /**
     * Test that a developer can update a document.
     *
     * @return void
     */
    public function test_developer_can_update_document()
    {
        $developer = $this->createUserWithRoleAndToken('developer');

        // Confirm that the user has the 'developer' role
        $this->assertTrue($developer->hasRole('developer'), 'User does not have developer role.');

        // Create a document uploaded by the developer
        $document = Document::factory()->create([
            'name' => 'Dev Document',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/dev-document.pdf',
            'uploaded_by' => $developer->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Dev Document',
            'project_id' => $document->project_id,
            'url' => 'https://example.com/updated-dev-document.pdf',
        ];

        // Make a PUT request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->putJson("/documents/{$document->id}", $updatedData);

        // Assert that the document was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document updated successfully.',
                'document' => [
                    'id' => $document->id,
                    'name' => 'Updated Dev Document',
                    'project_id' => $document->project_id,
                    'url' => 'https://example.com/updated-dev-document.pdf',
                    'uploaded_by' => $developer->id,
                ],
            ]);

        // Verify that the document was updated in the database
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => 'Updated Dev Document',
            'url' => 'https://example.com/updated-dev-document.pdf',
        ]);
    }

    /**
     * Test that a client can update their own document.
     *
     * @return void
     */
    public function test_client_can_update_their_own_document()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create a document for the client
        $document = Document::factory()->create([
            'name' => 'Client Document',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/client-document.pdf',
            'uploaded_by' => $client->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Updated Client Document',
            'project_id' => $document->project_id,
            'url' => 'https://example.com/updated-client-document.pdf',
        ];

        // Make a PUT request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->putJson("/documents/{$document->id}", $updatedData);

        // Assert that the document was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document updated successfully.',
                'document' => [
                    'id' => $document->id,
                    'name' => 'Updated Client Document',
                    'project_id' => $document->project_id,
                    'url' => 'https://example.com/updated-client-document.pdf',
                    'uploaded_by' => $client->id,
                ],
            ]);

        // Verify that the document was updated in the database
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => 'Updated Client Document',
            'url' => 'https://example.com/updated-client-document.pdf',
        ]);
    }

    /**
     * Test that an admin can delete a document.
     *
     * @return void
     */
    public function test_admin_can_delete_document()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Confirm that the user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), 'User does not have admin role.');

        // Create a document
        $document = Document::factory()->create([
            'name' => 'Document to Delete',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/document-to-delete.pdf',
            'uploaded_by' => $admin->id,
        ]);

        // Make a DELETE request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->deleteJson("/documents/{$document->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document deleted successfully.',
            ]);

        // Verify that the document no longer exists in the database
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
            'name' => 'Document to Delete',
            'url' => 'https://example.com/document-to-delete.pdf',
        ]);
    }

    /**
     * Test that a developer can delete a document.
     *
     * @return void
     */
    public function test_developer_can_delete_document()
    {
        $developer = $this->createUserWithRoleAndToken('developer');

        // Confirm that the user has the 'developer' role
        $this->assertTrue($developer->hasRole('developer'), 'User does not have developer role.');

        // Create a document uploaded by the developer
        $document = Document::factory()->create([
            'name' => 'Developer Document to Delete',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/developer-document-to-delete.pdf',
            'uploaded_by' => $developer->id,
        ]);

        // Make a DELETE request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->deleteJson("/documents/{$document->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document deleted successfully.',
            ]);

        // Verify that the document no longer exists in the database
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
            'name' => 'Developer Document to Delete',
            'url' => 'https://example.com/developer-document-to-delete.pdf',
        ]);
    }

    /**
     * Test that a client can delete their own document.
     *
     * @return void
     */
    public function test_client_can_delete_their_own_document()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create a document for the client
        $document = Document::factory()->create([
            'name' => 'Client Document to Delete',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/client-document-to-delete.pdf',
            'uploaded_by' => $client->id,
        ]);

        // Make a DELETE request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/documents/{$document->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document deleted successfully.',
            ]);

        // Verify that the document no longer exists in the database
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
            'name' => 'Client Document to Delete',
            'url' => 'https://example.com/client-document-to-delete.pdf',
        ]);
    }

    /**
     * Test that an admin can view a specific document.
     *
     * @return void
     */
    public function test_admin_can_view_specific_document()
    {
        $admin = $this->createUserWithRoleAndToken('admin');

        // Confirm that the user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), 'User does not have admin role.');

        // Create a document
        $document = Document::factory()->create([
            'name' => 'Specific Document',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/specific-document.pdf',
            'uploaded_by' => $admin->id,
        ]);

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson("/documents/{$document->id}");

        // Assert that the response is successful and contains the document data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $document->id,
                'name' => 'Specific Document',
                'project_id' => $document->project_id,
                'url' => 'https://example.com/specific-document.pdf',
                // Adjust 'uploaded_by' assertion to check nested 'id'
                'uploaded_by' => [
                    'id' => $admin->id,
                    // Optionally, include other fields if necessary
                ],
            ]);
    }

    /**
     * Test that a developer can view a specific document.
     *
     * @return void
     */
    public function test_developer_can_view_specific_document()
    {
        $developer = $this->createUserWithRoleAndToken('developer');

        // Confirm that the user has the 'developer' role
        $this->assertTrue($developer->hasRole('developer'), 'User does not have developer role.');

        // Create a document uploaded by the developer
        $document = Document::factory()->create([
            'name' => 'Developer Specific Document',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/developer-specific-document.pdf',
            'uploaded_by' => $developer->id,
        ]);

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->getJson("/documents/{$document->id}");

        // Assert that the response is successful and contains the document data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $document->id,
                'name' => 'Developer Specific Document',
                'project_id' => $document->project_id,
                'url' => 'https://example.com/developer-specific-document.pdf',
                // Adjust 'uploaded_by' assertion to check nested 'id'
                'uploaded_by' => [
                    'id' => $developer->id,
                    // Optionally, include other fields if necessary
                ],
            ]);
    }

    /**
     * Test that a client can view their own document.
     *
     * @return void
     */
    public function test_client_can_view_their_own_document()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create a document for the client
        $document = Document::factory()->create([
            'name' => 'Client Document to View',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/client-document-to-view.pdf',
            'uploaded_by' => $client->id,
        ]);

        // Make a GET request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson("/documents/{$document->id}");

        // Assert that the response is successful and contains the document data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $document->id,
                'name' => 'Client Document to View',
                'project_id' => $document->project_id,
                'url' => 'https://example.com/client-document-to-view.pdf',
                // Adjust 'uploaded_by' assertion to check nested 'id'
                'uploaded_by' => [
                    'id' => $client->id,
                    // Optionally, include other fields if necessary
                ],
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
        Document::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/documents');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test that a client cannot update others' documents.
     *
     * @return void
     */
    public function test_client_cannot_update_others_documents()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create a document for another user
        $otherUser = User::factory()->create();
        $otherDocument = Document::factory()->create([
            'name' => 'Other User Document',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/other-user-document.pdf',
            'uploaded_by' => $otherUser->id,
        ]);

        // Define updated data
        $updatedData = [
            'name' => 'Attempted Update',
            'project_id' => $otherDocument->project_id,
            'url' => 'https://example.com/attempted-update.pdf',
        ];

        // Make a PUT request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->putJson("/documents/{$otherDocument->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the document was not updated in the database
        $this->assertDatabaseHas('documents', [
            'id' => $otherDocument->id,
            'name' => 'Other User Document',
            'url' => 'https://example.com/other-user-document.pdf',
        ]);
    }

    /**
     * Test that a client cannot delete others' documents.
     *
     * @return void
     */
    public function test_client_cannot_delete_others_documents()
    {
        $client = $this->createUserWithRoleAndToken('client');

        // Confirm that the user has the 'client' role
        $this->assertTrue($client->hasRole('client'), 'User does not have client role.');

        // Create a document for another user
        $otherUser = User::factory()->create();
        $otherDocument = Document::factory()->create([
            'name' => 'Other User Document to Delete',
            'project_id' => Project::factory()->create()->id,
            'url' => 'https://example.com/other-user-document-to-delete.pdf',
            'uploaded_by' => $otherUser->id,
        ]);

        // Make a DELETE request with the API token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/documents/{$otherDocument->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the document still exists in the database
        $this->assertDatabaseHas('documents', [
            'id' => $otherDocument->id,
            'name' => 'Other User Document to Delete',
            'url' => 'https://example.com/other-user-document-to-delete.pdf',
        ]);
    }
}
