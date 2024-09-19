<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class MiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear(); // Clear rate limits for fresh testing
    }

    /** @test */
    public function unauthenticated_users_are_redirected()
    {
        $response = $this->getJson('/client/dashboard');
        $response->assertStatus(401); // Unauthenticated
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    /** @test */
    public function users_without_correct_role_are_forbidden()
    {
        $user = User::factory()->create();

        // Simulate a logged-in user without the correct role
        $this->actingAs($user);

        $response = $this->getJson('/admin/dashboard');
        $response->assertStatus(403); // Forbidden
        $response->assertJson(['message' => 'Forbidden.']);
    }

    /** @test */
    public function users_with_correct_role_can_access_dashboard()
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(1); // Assuming 1 is the admin role ID

        // Simulate a logged-in admin user
        $this->actingAs($admin);

        $response = $this->getJson('/admin/dashboard');
        $response->assertStatus(200); // Success
        $response->assertJson(['message' => 'Welcome to the Admin Dashboard']);
    }

    /** @test */
    public function users_are_rate_limited()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Exceed rate limit
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/messages', ['message' => 'Test message']);
        }

        $response->assertStatus(429); // Too many requests
        $response->assertJson(['message' => 'Too many attempts. Please try again later.']);
    }

    /** @test */
    public function authenticated_users_can_access_rate_limited_routes()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Attempt to access a rate-limited route
        $response = $this->postJson('/messages', ['message' => 'Test message']);
        $response->assertStatus(201); // Created
    }
}
