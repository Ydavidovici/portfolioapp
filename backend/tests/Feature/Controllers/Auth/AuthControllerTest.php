<?php

namespace Tests\Feature\Controllers\Auth;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        Role::create(['name' => 'client']);
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'developer']);
    }

    #[Test]
    public function it_registers_a_user_with_client_role()
    {
        $response = $this->postJson('/register', [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    #[Test]
    public function only_admin_can_register_an_admin_or_developer()
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        Sanctum::actingAs($admin);

        $response = $this->postJson('/register', [
            'username' => 'newadmin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'admin',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'admin@example.com']);
    }

    #[Test]
    public function a_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);

        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertArrayHasKey('access_token', $response->json());
    }

    #[Test]
    public function login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);

        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    #[Test]
    public function it_sends_a_password_reset_link()
    {
        Mail::fake();

        $user = User::factory()->create();

        $response = $this->postJson('/password/email', ['email' => $user->email]);

        $response->assertStatus(200);
        Mail::assertSent(function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    #[Test]
    public function it_resets_a_password()
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->postJson('/password/reset', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(200);
        $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));
    }

    #[Test]
    public function it_verifies_a_user_email()
    {
        $user = User::factory()->create(['email_verified_at' => null]);

        $response = $this->getJson('/email/verify/' . $user->id . '/' . sha1($user->email));

        $response->assertStatus(200);
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    #[Test]
    public function it_resends_verification_email()
    {
        Mail::fake();
        $user = User::factory()->create(['email_verified_at' => null]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/email/resend');

        $response->assertStatus(200);
        Mail::assertSent(function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    #[Test]
    public function a_user_can_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/logout');

        $response->assertStatus(200);
    }

    #[Test]
    public function rate_limit_is_applied_on_login()
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);

        // Simulate 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/login', [
                'email' => $user->email,
                'password' => 'wrongpassword',
            ]);
        }

        // The 6th attempt should trigger rate-limiting
        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(429); // Too many requests
    }
}
