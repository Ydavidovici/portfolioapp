<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentControllerTest extends TestCase
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
     * Test that an admin can create a payment.
     *
     * @return void
     */
    public function test_admin_can_create_payment()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define payment data
        $paymentData = [
            'amount' => 500.00,
            'user_id' => $admin->id,
            'invoice_id' => 1, // Ensure an invoice with ID 1 exists or adjust accordingly
            // Add other necessary fields as per your Payment model
        ];

        // Act as the admin and make a POST request to create a payment
        $response = $this->actingAs($admin)->postJson('/payments', $paymentData);

        // Assert that the payment was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'amount' => 500.00,
                'user_id' => $admin->id,
                'invoice_id' => 1,
            ]);

        // Verify that the payment exists in the database
        $this->assertDatabaseHas('payments', [
            'amount' => 500.00,
            'user_id' => $admin->id,
            'invoice_id' => 1,
        ]);
    }

    /**
     * Test that a client can create a payment.
     *
     * @return void
     */
    public function test_client_can_create_payment()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define payment data
        $paymentData = [
            'amount' => 300.00,
            'user_id' => $client->id,
            'invoice_id' => 2, // Ensure an invoice with ID 2 exists or adjust accordingly
            // Add other necessary fields as per your Payment model
        ];

        // Act as the client and make a POST request to create a payment
        $response = $this->actingAs($client)->postJson('/payments', $paymentData);

        // Assert that the payment was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'amount' => 300.00,
                'user_id' => $client->id,
                'invoice_id' => 2,
            ]);

        // Verify that the payment exists in the database
        $this->assertDatabaseHas('payments', [
            'amount' => 300.00,
            'user_id' => $client->id,
            'invoice_id' => 2,
        ]);
    }

    /**
     * Test that a developer cannot delete a payment.
     *
     * @return void
     */
    public function test_developer_cannot_delete_payment()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a payment
        $payment = Payment::factory()->create([
            'amount' => 400.00,
            'user_id' => $developer->id,
            'invoice_id' => 3, // Ensure an invoice with ID 3 exists or adjust accordingly
        ]);

        // Act as the developer and attempt to delete the payment
        $response = $this->actingAs($developer)->deleteJson("/payments/{$payment->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the payment still exists in the database
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 400.00,
        ]);
    }

    /**
     * Test that an admin can update any payment.
     *
     * @return void
     */
    public function test_admin_can_update_any_payment()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a payment
        $payment = Payment::factory()->create([
            'amount' => 250.00,
            'user_id' => $admin->id,
            'invoice_id' => 1,
        ]);

        // Define updated data
        $updatedData = [
            'amount' => 300.00,
        ];

        // Act as the admin and make a PUT request to update the payment
        $response = $this->actingAs($admin)->putJson("/payments/{$payment->id}", $updatedData);

        // Assert that the payment was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'amount' => 300.00,
                'user_id' => $admin->id,
                'invoice_id' => 1,
            ]);

        // Verify that the payment was updated in the database
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 300.00,
        ]);
    }

    /**
     * Test that a client cannot update another client's payment.
     *
     * @return void
     */
    public function test_client_cannot_update_others_payment()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create();
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create();
        $client2->roles()->attach($clientRole);

        // Create a payment for client2
        $payment = Payment::factory()->create([
            'amount' => 350.00,
            'user_id' => $client2->id,
            'invoice_id' => 2,
        ]);

        // Define updated data
        $updatedData = [
            'amount' => 400.00,
        ];

        // Act as client1 and attempt to update client2's payment
        $response = $this->actingAs($client1)->putJson("/payments/{$payment->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the payment was not updated in the database
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 350.00,
        ]);
    }

    /**
     * Test that an admin can delete any payment.
     *
     * @return void
     */
    public function test_admin_can_delete_any_payment()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a payment
        $payment = Payment::factory()->create([
            'amount' => 600.00,
            'user_id' => $admin->id,
            'invoice_id' => 1,
        ]);

        // Act as the admin and make a DELETE request to delete the payment
        $response = $this->actingAs($admin)->deleteJson("/payments/{$payment->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the payment no longer exists in the database
        $this->assertDatabaseMissing('payments', [
            'id' => $payment->id,
        ]);
    }

    /**
     * Test that a client can view their own payments.
     *
     * @return void
     */
    public function test_client_can_view_their_own_payments()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create payments for the client
        $clientPayments = Payment::factory()->count(2)->create([
            'user_id' => $client->id,
        ]);

        // Create payments for another user
        $otherPayments = Payment::factory()->count(2)->create();

        // Act as the client and make a GET request to view payments
        $response = $this->actingAs($client)->getJson('/payments');

        // Assert that the response contains only the client's payments
        $response->assertStatus(200)
            ->assertJsonCount(2);

        foreach ($clientPayments as $payment) {
            $response->assertJsonFragment([
                'id' => $payment->id,
                'amount' => $payment->amount,
                'user_id' => $client->id,
            ]);
        }

        // Ensure that other payments are not visible
        foreach ($otherPayments as $payment) {
            $response->assertJsonMissing([
                'id' => $payment->id,
                'amount' => $payment->amount,
            ]);
        }
    }

    /**
     * Test that an unauthenticated user cannot access payments.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_payments()
    {
        // Create payments
        $payments = Payment::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/payments');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
