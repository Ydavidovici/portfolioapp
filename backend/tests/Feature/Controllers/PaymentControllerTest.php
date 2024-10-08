<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;
use Mockery;
use Stripe\PaymentIntent;

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

        // Set Stripe configuration for testing
        config([
            'services.stripe.secret' => env('STRIPE_SECRET', 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXX'),
            'services.stripe.currency' => 'usd',
        ]);
    }

    /**
     * Tear down the test environment.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Helper method to assign an API token to a user and get headers.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    protected function getAuthHeaders(User $user): array
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
     * Test that an admin can create a payment.
     *
     * @return void
     */
    public function test_admin_can_create_payment()
    {
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Mock the Stripe\PaymentIntent class
        $paymentIntentMock = Mockery::mock('alias:Stripe\PaymentIntent');
        $paymentIntentMock->shouldReceive('create')
            ->once()
            ->withArgs(function ($args) use ($admin, $invoice) {
                // Validate the arguments
                return $args['amount'] === 50000 && // 500.00 USD in cents
                    $args['currency'] === 'usd' &&
                    $args['payment_method'] === 'pm_card_visa' &&
                    $args['confirmation_method'] === 'manual' &&
                    $args['confirm'] === true &&
                    $args['metadata']['user_id'] === $admin->id &&
                    $args['metadata']['invoice_id'] === $invoice->id;
            })
            ->andReturn((object)[
                'id' => 'pi_test1234567890',
                'status' => 'succeeded',
                'client_secret' => 'pi_client_secret_test123',
            ]);

        // Define payment data (excluding 'payment_date')
        $paymentData = [
            'invoice_id' => $invoice->id,
            'amount' => 500.00,
            'payment_method' => 'pm_card_visa', // Use Stripe test payment methods
        ];

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a POST request to create a payment
        $response = $this->withHeaders($headers)->postJson('/payments', $paymentData);

        // If the response status is not 201, dump the response for debugging
        // $response->dumpIfNotSuccessful();

        // Assert that the payment was created successfully using assertJson
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Payment successful.',
                'payment' => [
                    'amount' => 500.00,
                    'invoice_id' => $invoice->id,
                    'payment_method' => 'pm_card_visa',
                    'status' => 'succeeded',
                ],
            ]);

        // Verify that the payment exists in the database with the correct user_id
        $this->assertDatabaseHas('payments', [
            'amount' => 500.00,
            'invoice_id' => $invoice->id,
            'user_id' => $admin->id,
            'payment_method' => 'pm_card_visa',
            'status' => 'succeeded',
            'stripe_payment_intent_id' => 'pi_test1234567890',
        ]);
    }

    /**
     * Test that a client can create a payment.
     *
     * @return void
     */
    public function test_client_can_create_payment()
    {
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Mock the Stripe\PaymentIntent class
        $paymentIntentMock = Mockery::mock('alias:Stripe\PaymentIntent');
        $paymentIntentMock->shouldReceive('create')
            ->once()
            ->withArgs(function ($args) use ($client, $invoice) {
                // Validate the arguments
                return $args['amount'] === 30000 && // 300.00 USD in cents
                    $args['currency'] === 'usd' &&
                    $args['payment_method'] === 'pm_card_mastercard' &&
                    $args['confirmation_method'] === 'manual' &&
                    $args['confirm'] === true &&
                    $args['metadata']['user_id'] === $client->id &&
                    $args['metadata']['invoice_id'] === $invoice->id;
            })
            ->andReturn((object)[
                'id' => 'pi_test0987654321',
                'status' => 'succeeded',
                'client_secret' => 'pi_client_secret_test456',
            ]);

        // Define payment data (excluding 'payment_date')
        $paymentData = [
            'invoice_id' => $invoice->id,
            'amount' => 300.00,
            'payment_method' => 'pm_card_mastercard', // Use Stripe test payment methods
        ];

        // Assign an API token to the client and get headers
        $headers = $this->getAuthHeaders($client);

        // Act as the client and make a POST request to create a payment
        $response = $this->withHeaders($headers)->postJson('/payments', $paymentData);

        // If the response status is not 201, dump the response for debugging
        // $response->dumpIfNotSuccessful();

        // Assert that the payment was created successfully using assertJson
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Payment successful.',
                'payment' => [
                    'amount' => 300.00,
                    'invoice_id' => $invoice->id,
                    'payment_method' => 'pm_card_mastercard',
                    'status' => 'succeeded',
                ],
            ]);

        // Verify that the payment exists in the database with the correct user_id
        $this->assertDatabaseHas('payments', [
            'amount' => 300.00,
            'invoice_id' => $invoice->id,
            'user_id' => $client->id,
            'payment_method' => 'pm_card_mastercard',
            'status' => 'succeeded',
            'stripe_payment_intent_id' => 'pi_test0987654321',
        ]);
    }

    /**
     * Test that a developer can delete a payment.
     *
     * @return void
     */
    public function test_developer_can_delete_payment()
    {
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create([
            'password' => Hash::make('developerpassword'),
        ]);
        $developer->roles()->attach($developerRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Create a payment associated with the developer and invoice
        $payment = Payment::factory()->create([
            'amount' => 400.00,
            'user_id' => $developer->id,
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_discover',
            'stripe_payment_intent_id' => 'pi_testunique1234',
            'status' => 'succeeded',
        ]);

        // Assign an API token to the developer and get headers
        $headers = $this->getAuthHeaders($developer);

        // Act as the developer and attempt to delete the payment
        $response = $this->withHeaders($headers)->deleteJson("/payments/{$payment->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment deleted successfully.',
            ]);

        // Verify that the payment no longer exists in the database
        $this->assertDatabaseMissing('payments', [
            'id' => $payment->id,
        ]);
    }

    /**
     * Test that an admin can update any payment.
     *
     * @return void
     */
    public function test_admin_can_update_any_payment()
    {
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Create a payment associated with the admin and invoice
        $payment = Payment::factory()->create([
            'amount' => 250.00,
            'user_id' => $admin->id,
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_amex',
            'stripe_payment_intent_id' => 'pi_testupdate1234',
            'status' => 'succeeded',
        ]);

        // Define updated data (excluding 'payment_date')
        $updatedData = [
            // 'invoice_id' => $invoice->id, // Optional: include if changing invoice
            'amount' => 300.00,
            'payment_method' => 'pm_card_discover', // Change to another test payment method
        ];

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a PUT request to update the payment
        $response = $this->withHeaders($headers)->putJson("/payments/{$payment->id}", $updatedData);

        // Assert that the payment was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment updated successfully.',
                'payment' => [
                    'id' => $payment->id,
                    'amount' => 300.00,
                    'user_id' => $admin->id,
                    'invoice_id' => $invoice->id, // Remains unchanged if not updated
                    'payment_method' => 'pm_card_discover',
                    'status' => 'succeeded',
                ],
            ]);

        // Verify that the payment was updated in the database
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 300.00,
            'payment_method' => 'pm_card_discover',
        ]);
    }

    /**
     * Test that a client cannot update another client's payment.
     *
     * @return void
     */
    public function test_client_cannot_update_others_payment()
    {
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create two client users
        $client1 = User::factory()->create([
            'password' => Hash::make('client1password'),
        ]);
        $client1->roles()->attach($clientRole);

        $client2 = User::factory()->create([
            'password' => Hash::make('client2password'),
        ]);
        $client2->roles()->attach($clientRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Create a payment for client2
        $payment = Payment::factory()->create([
            'amount' => 350.00,
            'user_id' => $client2->id,
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_mastercard',
            'stripe_payment_intent_id' => 'pi_testunique5678',
            'status' => 'succeeded',
        ]);

        // Define updated data
        $updatedData = [
            'amount' => 400.00,
            'payment_method' => 'pm_card_visa',
        ];

        // Assign an API token to client1 and get headers
        $headers = $this->getAuthHeaders($client1);

        // Act as client1 and attempt to update client2's payment
        $response = $this->withHeaders($headers)->putJson("/payments/{$payment->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the payment was not updated in the database
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => 350.00,
            'payment_method' => 'pm_card_mastercard',
        ]);
    }

    /**
     * Test that an admin can delete any payment.
     *
     * @return void
     */
    public function test_admin_can_delete_any_payment()
    {
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Create a payment associated with the admin and invoice
        $payment = Payment::factory()->create([
            'amount' => 600.00,
            'user_id' => $admin->id,
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_visa',
            'stripe_payment_intent_id' => 'pi_testunique9012',
            'status' => 'succeeded',
        ]);

        // Assign an API token to the admin and get headers
        $headers = $this->getAuthHeaders($admin);

        // Act as the admin and make a DELETE request to delete the payment
        $response = $this->withHeaders($headers)->deleteJson("/payments/{$payment->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment deleted successfully.',
            ]);

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
        // Enable detailed exception output for debugging
        // Only enable it if you're actively debugging this test
        // $this->withoutExceptionHandling();

        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'),
        ]);
        $client->roles()->attach($clientRole);

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Create payments for the client
        $clientPayments = Payment::factory()->count(2)->create([
            'user_id' => $client->id,
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_visa',
            'status' => 'succeeded',
            // 'stripe_payment_intent_id' will be unique via factory
        ]);

        // Create payments for another user
        $otherPayments = Payment::factory()->count(2)->create([
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_mastercard',
            'status' => 'succeeded',
            // 'stripe_payment_intent_id' will be unique via factory
        ]);

        // Assign an API token to the client and get headers
        $headers = $this->getAuthHeaders($client);

        // Act as the client and make a GET request to view payments
        $response = $this->withHeaders($headers)->getJson('/payments');

        // Assert that the response contains only the client's payments
        $response->assertStatus(200)
            ->assertJsonCount(2, 'payments') // Corrected key from 'payment' to 'payments'
            ->assertJsonStructure([
                'payments' => [
                    '*' => ['id', 'amount', 'user_id', 'invoice_id', 'payment_method', 'status', 'stripe_payment_intent_id', 'payment_date', 'created_at', 'updated_at'],
                ],
            ]);

        foreach ($clientPayments as $payment) {
            $response->assertJsonFragment([
                'id' => $payment->id,
                'amount' => $payment->amount,
                'user_id' => $client->id,
                'invoice_id' => $invoice->id,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status,
            ]);
        }

        // Ensure that other payments are not visible
        foreach ($otherPayments as $payment) {
            $response->assertJsonMissing([
                'id' => $payment->id,
                'payment_method' => $payment->payment_method,
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
        // Do NOT call withoutExceptionHandling() here
        // $this->withoutExceptionHandling(); // Removed

        // Create an invoice and get its ID
        $invoice = Invoice::factory()->create();

        // Create payments associated with the invoice
        $payments = Payment::factory()->count(2)->create([
            'invoice_id' => $invoice->id,
            'payment_date' => now()->toDateString(),
            'payment_method' => 'pm_card_visa',
            'status' => 'succeeded',
            // 'stripe_payment_intent_id' will be unique via factory
        ]);

        // Make a GET request without authentication
        $response = $this->getJson('/payments');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
