<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Invoice;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceControllerTest extends TestCase
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
     * Helper method to create a user with a specific role and return both the user and the plain token.
     *
     * @param string $roleName
     * @return array
     */
    protected function createUserWithRoleAndToken(string $roleName): array
    {
        $role = Role::where('name', $roleName)->first();

        // Generate a unique plain token for testing
        $plainToken = 'test-token-' . uniqid();
        $hashedToken = hash('sha256', $plainToken);

        // Create the user with the hashed API token
        $user = User::factory()->create([
            'api_token' => $hashedToken,
        ]);

        // Assign the specified role to the user
        $user->roles()->attach($role);

        return ['user' => $user, 'token' => $plainToken];
    }

    /**
     * Test that an admin can create an invoice.
     *
     * @return void
     */
    public function test_admin_can_create_invoice()
    {
        // Create an admin user with a role and token
        ['user' => $admin, 'token' => $adminToken] = $this->createUserWithRoleAndToken('admin');

        // Create a client user
        ['user' => $client, 'token' => $clientToken] = $this->createUserWithRoleAndToken('client');

        // Dynamically create a project
        $project = Project::factory()->create();

        // Define invoice data with the required 'status' field
        $invoiceData = [
            'title' => 'New Invoice',
            'amount' => 1500.00,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'status' => 'pending', // Added 'status' field with a valid value
        ];

        // Make a POST request with the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
            'Accept' => 'application/json',
        ])->postJson('/invoices', $invoiceData);

        // Assert that the invoice was created successfully using assertJsonFragment
        $response->assertStatus(201)
            ->assertJsonFragment([
                'message' => 'Invoice created successfully.',
                'title' => 'New Invoice',
                'amount' => 1500.00,
                'client_id' => $client->id,
                'project_id' => $project->id,
                'status' => 'pending',
            ]);

        // Alternatively, use assertJsonStructure to ensure all necessary fields are present
        /*
        $response->assertJsonStructure([
            'message',
            'invoice' => [
                'id',
                'title',
                'amount',
                'client_id',
                'project_id',
                'status',
                'created_at',
                'updated_at',
            ],
        ]);
        */

        // Verify that the invoice exists in the database
        $this->assertDatabaseHas('invoices', [
            'title' => 'New Invoice',
            'amount' => 1500.00,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'status' => 'pending',
        ]);
    }

    /**
     * Test that a client can view their own invoices.
     *
     * @return void
     */
    public function test_client_can_view_their_own_invoices()
    {
        // Create a client user with a role and token
        ['user' => $client, 'token' => $clientToken] = $this->createUserWithRoleAndToken('client');

        // Dynamically create a project
        $project = Project::factory()->create();

        // Create invoices for the client
        $clientInvoices = Invoice::factory()->count(2)->create([
            'client_id' => $client->id,
            'project_id' => $project->id,
            'status' => 'pending', // Ensure 'status' is set
        ]);

        // Create invoices for another client
        ['user' => $otherClient, 'token' => $otherClientToken] = $this->createUserWithRoleAndToken('client');
        $otherInvoices = Invoice::factory()->count(2)->create([
            'client_id' => $otherClient->id,
            'project_id' => $project->id,
            'status' => 'paid', // Different status
        ]);

        // Act as the client and make a GET request to view invoices
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $clientToken,
            'Accept' => 'application/json',
        ])->getJson('/invoices');

        // Assert that the response is OK
        $response->assertStatus(200);

        // Assert that the response contains only the client's invoices using assertJsonFragment
        $response->assertJsonFragment([
            'client_id' => $client->id,
        ]);

        // Assert that the response does not contain other clients' invoices
        foreach ($otherInvoices as $invoice) {
            $response->assertJsonMissing([
                'id' => $invoice->id,
                'title' => $invoice->title,
            ]);
        }

        // Optionally, ensure the correct number of invoices are returned
        $responseData = $response->json();
        $this->assertCount(2, $responseData, 'Client should only see their own invoices.');
    }

    /**
     * Test that a client cannot create an invoice.
     *
     * @return void
     */
    public function test_client_cannot_create_invoice()
    {
        // Create a client user with a role and token
        ['user' => $client, 'token' => $clientToken] = $this->createUserWithRoleAndToken('client');

        // Dynamically create a project
        $project = Project::factory()->create();

        // Define invoice data with the required 'status' field
        $invoiceData = [
            'title' => 'Unauthorized Invoice',
            'amount' => 2000.00,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'status' => 'pending', // Added 'status' field
        ];

        // Act as the client and make a POST request to create an invoice
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $clientToken,
            'Accept' => 'application/json',
        ])->postJson('/invoices', $invoiceData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the invoice does not exist in the database
        $this->assertDatabaseMissing('invoices', [
            'title' => 'Unauthorized Invoice',
            'amount' => 2000.00,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'status' => 'pending',
        ]);
    }

    /**
     * Test that an admin can update any invoice.
     *
     * @return void
     */
    public function test_admin_can_update_any_invoice()
    {
        // Create an admin user with a role and token
        ['user' => $admin, 'token' => $adminToken] = $this->createUserWithRoleAndToken('admin');

        // Dynamically create a project
        $project = Project::factory()->create();

        // Create an invoice
        $invoice = Invoice::factory()->create([
            'title' => 'Original Invoice',
            'amount' => 1000.00,
            'project_id' => $project->id,
            'status' => 'pending', // Set initial status
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Invoice',
            'amount' => 1200.00,
            'status' => 'paid', // Update status
        ];

        // Act as the admin and make a PUT request to update the invoice
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
            'Accept' => 'application/json',
        ])->putJson("/invoices/{$invoice->id}", $updatedData);

        // Assert that the invoice was updated successfully using assertJsonFragment
        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Invoice updated successfully.',
                'title' => 'Updated Invoice',
                'amount' => 1200.00,
                'status' => 'paid',
            ]);

        // Verify that the invoice was updated in the database
        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'title' => 'Updated Invoice',
            'amount' => 1200.00,
            'status' => 'paid',
        ]);
    }

    /**
     * Test that a client cannot update another client's invoice.
     *
     * @return void
     */
    public function test_client_cannot_update_others_invoice()
    {
        // Create two client users with roles and tokens
        ['user' => $client1, 'token' => $client1Token] = $this->createUserWithRoleAndToken('client');
        ['user' => $client2, 'token' => $client2Token] = $this->createUserWithRoleAndToken('client');

        // Dynamically create a project
        $project = Project::factory()->create();

        // Create an invoice for client2
        $invoice = Invoice::factory()->create([
            'title' => 'Client2 Invoice',
            'client_id' => $client2->id,
            'amount' => 1500.00,
            'project_id' => $project->id,
            'status' => 'pending', // Initial status
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update by Client1',
            'amount' => 1600.00,
            'status' => 'paid', // Attempting to change status
        ];

        // Act as client1 and attempt to update client2's invoice
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client1Token,
            'Accept' => 'application/json',
        ])->putJson("/invoices/{$invoice->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the invoice was not updated in the database
        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'title' => 'Client2 Invoice',
            'amount' => 1500.00,
            'status' => 'pending', // Status should remain unchanged
        ]);
    }

    /**
     * Test that an unauthenticated user cannot access invoices.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_invoices()
    {
        // Dynamically create a project
        $project = Project::factory()->create();

        // Create invoices
        $invoices = Invoice::factory()->count(2)->create([
            'project_id' => $project->id,
            'status' => 'pending',
        ]);

        // Make a GET request without authentication
        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->getJson('/invoices');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
