<?php

namespace Tests\Feature\Controllers;

use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_payments()
    {
        Payment::factory()->count(3)->create();

        $response = $this->getJson('/api/payments');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_payment()
    {
        $invoice = Invoice::factory()->create();

        $data = [
            'amount' => 150.00,
            'payment_date' => now(),
            'payment_method' => 'credit_card',
            'invoice_id' => $invoice->id,
        ];

        $response = $this->postJson('/api/payments', $data);

        $response->assertStatus(201)
            ->assertJson(['amount' => 150.00]);
    }

    public function test_can_update_payment()
    {
        $payment = Payment::factory()->create(['amount' => 100.00]);

        $response = $this->putJson("/api/payments/{$payment->id}", [
            'amount' => 200.00,
        ]);

        $response->assertStatus(200)
            ->assertJson(['amount' => 200.00]);
    }

    public function test_can_delete_payment()
    {
        $payment = Payment::factory()->create();

        $response = $this->deleteJson("/api/payments/{$payment->id}");

        $response->assertStatus(204);
    }
}
