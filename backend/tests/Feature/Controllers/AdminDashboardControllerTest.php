<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard()
    {
        $adminRole = Role::create(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $response = $this->actingAs($admin, 'sanctum')->get('/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Admin Dashboard',
            ]);
    }

    public function test_non_admin_cannot_access_admin_dashboard()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->get('/admin/dashboard');

        $response->assertStatus(403);
    }
}
