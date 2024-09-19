<?php

namespace Tests\Feature\Controllers;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_invoices()
    {
        $user = User::factory()->create();
        Invoice::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/invoices');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_invoice()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $data = [
            'amount' => 100.50,
            'status' => 'pending',
            'client_id' => $user->id,
            'project_id' => $project->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/invoices', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Invoice created successfully.']);
    }

    public function test_can_update_invoice()
    {
        $user = User::factory()->create();
        $invoice = Invoice::factory()->create(['amount' => 100.00]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/invoices/{$invoice->id}", [
            'amount' => 150.00,
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Invoice updated successfully.']);
    }

    public function test_can_delete_invoice()
    {
        $user = User::factory()->create();
        $invoice = Invoice::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/invoices/{$invoice->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Invoice deleted successfully.']);
    }
}
