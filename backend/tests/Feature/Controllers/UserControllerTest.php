<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_users()
    {
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_user()
    {
        $data = [
            'username' => 'newuser',
            'email' => 'newuser@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/users', $data);

        $response->assertStatus(201)
            ->assertJson(['username' => 'newuser']);
    }

    public function test_can_update_user()
    {
        $user = User::factory()->create(['username' => 'olduser']);

        $response = $this->putJson("/api/users/{$user->id}", [
            'username' => 'updateduser',
        ]);

        $response->assertStatus(200)
            ->assertJson(['username' => 'updateduser']);
    }

    public function test_can_delete_user()
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(204);
    }
}
