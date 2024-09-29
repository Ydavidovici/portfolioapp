<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Seed the roles into the database
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Helper method to authenticate a user by setting the Authorization header.
     *
     * @param User $user
     * @return $this
     */
    protected function authenticate(User $user)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $user->api_token,
        ]);
    }

    /**
     * Test that an admin can access the dashboard.
     */
    public function test_admin_can_access_dashboard()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Generate a raw API token
        $rawToken = Str::random(60);

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'api_token' => hash('sha256', $rawToken), // Store hashed token
        ]);
        $admin->roles()->attach($adminRole);

        // Authenticate as admin by setting the Authorization header with the raw token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->getJson('/admin/dashboard');

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
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Generate a raw API token
        $rawToken = Str::random(60);

        // Create a client user and assign the 'client' role
        $user = User::factory()->create([
            'api_token' => hash('sha256', $rawToken), // Store hashed token
        ]);
        $user->roles()->attach($clientRole);

        // Authenticate as client by setting the Authorization header with the raw token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->getJson('/admin/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }
}
