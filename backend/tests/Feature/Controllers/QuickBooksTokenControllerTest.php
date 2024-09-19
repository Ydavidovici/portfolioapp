<?php

namespace Tests\Feature\Controllers;

use App\Models\QuickBooksToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuickBooksTokenControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_tokens()
    {
        QuickBooksToken::factory()->count(3)->create();

        $response = $this->getJson('/api/quickbooks-tokens');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_token()
    {
        $data = [
            'access_token' => 'sample_access_token',
            'refresh_token' => 'sample_refresh_token',
            'expires_at' => now()->addHour(),
        ];

        $response = $this->postJson('/api/quickbooks-tokens', $data);

        $response->assertStatus(201)
            ->assertJson(['access_token' => 'sample_access_token']);
    }

    public function test_can_update_token()
    {
        $token = QuickBooksToken::factory()->create(['access_token' => 'old_token']);

        $response = $this->putJson("/api/quickbooks-tokens/{$token->id}", [
            'access_token' => 'updated_token',
        ]);

        $response->assertStatus(200)
            ->assertJson(['access_token' => 'updated_token']);
    }

    public function test_can_delete_token()
    {
        $token = QuickBooksToken::factory()->create();

        $response = $this->deleteJson("/api/quickbooks-tokens/{$token->id}");

        $response->assertStatus(204);
    }
}
