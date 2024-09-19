<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_access_dashboard()
    {
        $clientRole = Role::create(['name' => 'client']);
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        $response = $this->actingAs($client, 'sanctum')->get('/client/dashboard');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Welcome to the Client Dashboard']);
    }

    public function test_non_client_cannot_access_client_dashboard()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->get('/client/dashboard');

        $response->assertStatus(403);
    }
}
