<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Invoice;
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
     * Test that an admin can create an invoice.
     *
     * @return void
     */
    public function test_admin_can_create_invoice()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define invoice data
        $invoiceData = [
            'title' => 'New Invoice',
            'amount' => 1500.00,
            'client_id' => 1, // Ensure a client with ID 1 exists or adjust accordingly
            'project_id' => 1, // Ensure a project with ID 1 exists or adjust accordingly
            // Add other necessary fields as per your Invoice model
        ];

        // Act as the admin and make a POST request to create an invoice
        $response = $this->actingAs($admin)->postJson('/invoices', $invoiceData);

        // Assert that the invoice was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Invoice created successfully.',
                'invoice' => [
                    'title' => 'New Invoice',
                    'amount' => 1500.00,
                    'client_id' => 1,
                    'project_id' => 1,
                ],
            ]);

        // Verify that the invoice exists in the database
        $this->assertDatabaseHas('invoices', [
            'title' => 'New Invoice',
            'amount' => 1500.00,
            'client_id' => 1,
            'project_id' => 1,
        ]);
    }

    /**
     * Test that a client can view their own invoices.
     *
     * @return void
     */
    public function test_client_can_view_their_own_invoices()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create invoices for the client
        $clientInvoices = Invoice::factory()->count(2)->create([
            'client_id' => $client->id,
        ]);

        // Create invoices for another client
        $otherInvoices = Invoice::factory()->count(2)->create();

        // Act as the client and make a GET request to view invoices
        $response = $this->actingAs($client)->getJson('/invoices');

        // Assert that the response contains only the client's invoices
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($clientInvoices as $invoice) {
            $response->assertJsonFragment([
                'id' => $invoice->id,
                'title' => $invoice->title,
                'client_id' => $client->id,
            ]);
        }

        // Ensure that other invoices are not visible
        foreach ($otherInvoices as $invoice) {
            $response->assertJsonMissing([
                'id' => $invoice->id,
                'title' => $invoice->title,
            ]);
        }
    }

    /**
     * Test that a client cannot create an invoice.
     *
     * @return void
     */
    public function test_client_cannot_create_invoice()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define invoice data
        $invoiceData = [
            'title' => 'Unauthorized Invoice',
            'amount' => 2000.00,
            'client_id' => $client->id,
            'project_id' => 2,
            // Add other necessary fields as per your Invoice model
        ];

        // Act as the client and make a POST request to create an invoice
        $response = $this->actingAs($client)->postJson('/invoices', $invoiceData);

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
            'project_id' => 2,
        ]);
    }

    /**
     * Test that an admin can update any invoice.
     *
     * @return void
     */
    public function test_admin_can_update_any_invoice()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create an invoice
        $invoice = Invoice::factory()->create([
            'title' => 'Original Invoice',
            'amount' => 1000.00,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Invoice',
            'amount' => 1200.00,
        ];

        // Act as the admin and make a PUT request to update the invoice
        $response = $this->actingAs($admin)->putJson("/invoices/{$invoice->id}", $updatedData);

        // Assert that the invoice was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Invoice updated successfully.',
                'invoice' => [
                    'id' => $invoice->id,
                    'title' => 'Updated Invoice',
                    'amount' => 1200.00,
                ],
            ]);

        // Verify that the invoice was updated in the database
        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'title' => 'Updated Invoice',
            'amount' => 1200.00,
        ]);
    }

    /**
     * Test that a client cannot update another client's invoice.
     *
     * @return void
     */
    public function test_client_cannot_update_others_invoice()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create();
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create();
        $client2->roles()->attach($clientRole);

        // Create an invoice for client2
        $invoice = Invoice::factory()->create([
            'title' => 'Client2 Invoice',
            'client_id' => $client2->id,
            'amount' => 1500.00,
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update by Client1',
            'amount' => 1600.00,
        ];

        // Act as client1 and attempt to update client2's invoice
        $response = $this->actingAs($client1)->putJson("/invoices/{$invoice->id}", $updatedData);

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
        ]);
    }

    /**
     * Test that a client can pay their own invoice.
     *
     * Assuming payment is handled via the update method by changing the 'status' field.
     *
     * @return void
     */
    public function test_client_can_pay_their_own_invoice()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create an invoice for the client
        $invoice = Invoice::factory()->create([
            'title' => 'Payable Invoice',
            'client_id' => $client->id,
            'amount' => 2000.00,
            'status' => 'unpaid',
        ]);

        // Define updated data to mark the invoice as paid
        $updatedData = [
            'status' => 'paid',
        ];

        // Act as the client and make a PUT request to pay the invoice
        $response = $this->actingAs($client)->putJson("/invoices/{$invoice->id}", $updatedData);

        // Assert that the invoice was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Invoice updated successfully.',
                'invoice' => [
                    'id' => $invoice->id,
                    'status' => 'paid',
                ],
            ]);

        // Verify that the invoice status was updated in the database
        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'paid',
        ]);
    }

    /**
     * Test that an unauthenticated user cannot access invoices.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_invoices()
    {
        // Create invoices
        $invoices = Invoice::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/invoices');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
