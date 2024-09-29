<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum; // Import Sanctum
use Tests\TestCase;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleSeeder::class); // Seed roles
    }

    /**
     * Test that an admin can access the dashboard.
     */
    public function test_admin_can_access_dashboard()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Use Sanctum's actingAs helper
        Sanctum::actingAs($admin, ['*']);

        $response = $this->getJson('/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Welcome to the Admin Dashboard',
            ])
            ->assertJsonStructure([
                'message',
                'users',
                'projects',
                'messages',
            ]);
    }

    /**
     * Test that a non-admin user cannot access the admin dashboard.
     */
    public function test_non_admin_cannot_access_admin_dashboard()
    {
        $user = User::factory()->create();

        // Assign a non-admin role, e.g., 'client'
        $clientRole = Role::where('name', 'client')->first();
        $user->roles()->attach($clientRole);

        // Use Sanctum's actingAs helper
        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson('/admin/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }
}
