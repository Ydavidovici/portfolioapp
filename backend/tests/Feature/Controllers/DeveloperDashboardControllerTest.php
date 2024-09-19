<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeveloperDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_developer_can_access_dashboard()
    {
        $developerRole = Role::create(['name' => 'developer']);
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        $response = $this->actingAs($developer, 'sanctum')->get('/developer/dashboard');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Welcome to the Developer Dashboard']);
    }

    public function test_non_developer_cannot_access_developer_dashboard()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->get('/developer/dashboard');

        $response->assertStatus(403);
    }
}
