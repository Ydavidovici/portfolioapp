<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Seed the roles into the database
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /**
     * Test that an admin can register a user with 'admin' role.
     *
     * @return void
     */
    public function test_admin_can_register_admin_user()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define registration data with 'admin' role
        $registrationData = [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ];

        // Act as the admin and make a POST request to register a new admin
        $response = $this->actingAs($admin, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
            ]);

        // Verify that the user exists in the database with the 'admin' role
        $this->assertDatabaseHas('users', ['email' => 'newadmin@example.com']);
        $newUser = User::where('email', 'newadmin@example.com')->first();
        $this->assertTrue($newUser->hasRole('admin'));
    }

    /**
     * Test that an admin can register a user with 'developer' role.
     *
     * @return void
     */
    public function test_admin_can_register_developer_user()
    {
        // Retrieve the 'admin' and 'developer' roles
        $adminRole = Role::where('name', 'admin')->first();
        $developerRole = Role::where('name', 'developer')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define registration data with 'developer' role
        $registrationData = [
            'username' => 'newdeveloper',
            'email' => 'newdeveloper@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'developer',
        ];

        // Act as the admin and make a POST request to register a new developer
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/register', $registrationData);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
            ]);

        // Verify that the user exists in the database with the 'developer' role
        $this->assertDatabaseHas('users', ['email' => 'newdeveloper@example.com']);
        $newUser = User::where('email', 'newdeveloper@example.com')->first();
        $this->assertTrue($newUser->hasRole('developer'));
    }

    /**
     * Test that an admin can register a user with 'client' role.
     *
     * @return void
     */
    public function test_admin_can_register_client_user()
    {
        // Retrieve the 'admin' and 'client' roles
        $adminRole = Role::where('name', 'admin')->first();
        $clientRole = Role::where('name', 'client')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define registration data with 'client' role
        $registrationData = [
            'username' => 'newclient',
            'email' => 'newclient@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'client',
        ];

        // Act as the admin and make a POST request to register a new client
        $response = $this->actingAs($admin, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
            ]);

        // Verify that the user exists in the database with the 'client' role
        $this->assertDatabaseHas('users', ['email' => 'newclient@example.com']);
        $newUser = User::where('email', 'newclient@example.com')->first();
        $this->assertTrue($newUser->hasRole('client'));
    }

    /**
     * Test that a non-admin cannot register a user with 'admin' role.
     *
     * @return void
     */
    public function test_non_admin_cannot_register_admin_user()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define registration data with 'admin' role
        $registrationData = [
            'username' => 'unauthorizedadmin',
            'email' => 'unauthorizedadmin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ];

        // Act as the developer and make a POST request to register a new admin
        $response = $this->actingAs($developer, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration was forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
            ]);

        // Verify that the user does not exist in the database
        $this->assertDatabaseMissing('users', ['email' => 'unauthorizedadmin@example.com']);
    }

    /**
     * Test that a non-admin cannot register a user with 'developer' role.
     *
     * @return void
     */
    public function test_non_admin_cannot_register_developer_user()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define registration data with 'developer' role
        $registrationData = [
            'username' => 'unauthorizeddeveloper',
            'email' => 'unauthorizeddeveloper@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'developer',
        ];

        // Act as the client and make a POST request to register a new developer
        $response = $this->actingAs($client, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration was forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
            ]);

        // Verify that the user does not exist in the database
        $this->assertDatabaseMissing('users', ['email' => 'unauthorizeddeveloper@example.com']);
    }

    /**
     * Test that any user can register with the default 'client' role.
     *
     * @return void
     */
    public function test_any_user_can_register_client_user()
    {
        // No authenticated user (registration as guest)

        // Define registration data without specifying a role (defaults to 'client')
        $registrationData = [
            'username' => 'guestclient',
            'email' => 'guestclient@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            // 'role' is omitted to default to 'client'
        ];

        // Make a POST request to register a new client
        $response = $this->postJson('/register', $registrationData);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
            ]);

        // Verify that the user exists in the database with the 'client' role
        $this->assertDatabaseHas('users', ['email' => 'guestclient@example.com']);
        $newUser = User::where('email', 'guestclient@example.com')->first();
        $this->assertTrue($newUser->hasRole('client'));
    }

    /**
     * Test that a user can log in with correct credentials and verified email.
     *
     * @return void
     */
    public function test_user_can_login_with_correct_credentials_and_verified_email()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'verifieduser@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to login
        $response = $this->postJson('/login', [
            'email' => 'verifieduser@example.com',
            'password' => 'password123',
        ]);

        // Assert that the login was successful and token is returned
        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
            ]);
    }

    /**
     * Test that a user cannot log in with incorrect credentials.
     *
     * @return void
     */
    public function test_user_cannot_login_with_incorrect_credentials()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'verifieduser@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to login with incorrect password
        $response = $this->postJson('/login', [
            'email' => 'verifieduser@example.com',
            'password' => 'wrongpassword',
        ]);

        // Assert that the login was forbidden due to incorrect credentials
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test that a user cannot log in without verifying their email.
     *
     * @return void
     */
    public function test_user_cannot_login_without_verifying_email()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'unverifieduser@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to login
        $response = $this->postJson('/login', [
            'email' => 'unverifieduser@example.com',
            'password' => 'password123',
        ]);

        // Assert that the login was forbidden due to unverified email
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Please verify your email address.',
            ]);
    }

    /**
     * Test that login throttling works after multiple failed attempts.
     *
     * @return void
     */
    public function test_login_throttling_after_multiple_failed_attempts()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'verifieduser@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Make 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/login', [
                'email' => 'verifieduser@example.com',
                'password' => 'wrongpassword',
            ]);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        }

        // The 6th attempt should be throttled
        $response = $this->postJson('/login', [
            'email' => 'verifieduser@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(429)
            ->assertJson([
                'message' => 'Too many login attempts. Please try again later.',
            ]);
    }

    /**
     * Test that an authenticated user can log out successfully.
     *
     * @return void
     */
    public function test_authenticated_user_can_logout()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'verifieduser@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Login the user to obtain a token
        $loginResponse = $this->postJson('/login', [
            'email' => 'verifieduser@example.com',
            'password' => 'password123',
        ]);

        $token = $loginResponse->json('access_token');

        // Act as the user and make a POST request to logout
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/logout');

        // Assert that the logout was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out.',
            ]);
    }

    /**
     * Test that an authenticated user can change their password.
     *
     * @return void
     */
    public function test_authenticated_user_can_change_password()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('oldpassword'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Login the user to obtain a token
        $loginResponse = $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'oldpassword',
        ]);

        $token = $loginResponse->json('access_token');

        // Define change password data
        $changePasswordData = [
            'current_password' => 'oldpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        // Act as the user and make a POST request to change password
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/password/change', $changePasswordData);

        // Assert that the password was changed successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password changed successfully.',
            ]);

        // Verify that the user's password was updated in the database
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that a user cannot change their password with incorrect current password.
     *
     * @return void
     */
    public function test_user_cannot_change_password_with_incorrect_current_password()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('oldpassword'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Login the user to obtain a token
        $loginResponse = $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'oldpassword',
        ]);

        $token = $loginResponse->json('access_token');

        // Define change password data with incorrect current password
        $changePasswordData = [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        // Act as the user and make a POST request to change password
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/password/change', $changePasswordData);

        // Assert that the response contains validation errors for 'current_password'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('oldpassword', $user->fresh()->password));
        $this->assertFalse(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that a user can request a password reset link.
     *
     * @return void
     */
    public function test_user_can_request_password_reset_link()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to send reset link
        $response = $this->postJson('/password/email', [
            'email' => 'user@example.com',
        ]);

        // Assert that the reset link was sent
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reset link sent to your email.',
            ]);
    }

    /**
     * Test that a user can reset their password with a valid token.
     *
     * @return void
     */
    public function test_user_can_reset_password_with_valid_token()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('oldpassword'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate a password reset token
        $token = Password::createToken($user);

        // Define reset password data
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
            'token' => $token,
        ];

        // Act as the user and make a POST request to reset password
        $response = $this->postJson('/password/reset', $resetPasswordData);

        // Assert that the password was reset successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password has been reset.',
            ]);

        // Verify that the user's password was updated in the database
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that a user cannot reset their password with an invalid token.
     *
     * @return void
     */
    public function test_user_cannot_reset_password_with_invalid_token()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('oldpassword'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Define reset password data with invalid token
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
            'token' => 'invalidtoken',
        ];

        // Act as the user and make a POST request to reset password
        $response = $this->postJson('/password/reset', $resetPasswordData);

        // Assert that the response contains validation errors for 'email'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('oldpassword', $user->fresh()->password));
        $this->assertFalse(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that a user can verify their email with a valid link.
     *
     * @return void
     */
    public function test_user_can_verify_email_with_valid_link()
    {
        Event::fake();

        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate verification hash
        $hash = sha1($user->getEmailForVerification());

        // Act as the user and make a GET request to verify email
        $response = $this->get("/email/verify/{$user->id}/{$hash}");

        // Assert that the email was verified successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Email verified successfully.',
                'access_token' => $this->isString(),
                'token_type' => 'Bearer',
            ]);

        // Assert that the event was dispatched
        Event::assertDispatched(Verified::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });

        // Verify that the user's email is marked as verified
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    /**
     * Test that a user cannot verify their email with an invalid link.
     *
     * @return void
     */
    public function test_user_cannot_verify_email_with_invalid_link()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate invalid verification hash
        $invalidHash = sha1('invalidemail@example.com');

        // Act as the user and make a GET request to verify email with invalid hash
        $response = $this->get("/email/verify/{$user->id}/{$invalidHash}");

        // Assert that the verification failed
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Invalid verification link.',
            ]);

        // Verify that the user's email is still unverified
        $this->assertNull($user->fresh()->email_verified_at);
    }

    /**
     * Test that an already verified user cannot verify their email again.
     *
     * @return void
     */
    public function test_already_verified_user_cannot_verify_email_again()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate verification hash
        $hash = sha1($user->getEmailForVerification());

        // Act as the user and make a GET request to verify email again
        $response = $this->get("/email/verify/{$user->id}/{$hash}");

        // Assert that the email is already verified
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);
    }

    /**
     * Test that an authenticated user can resend verification email.
     *
     * @return void
     */
    public function test_authenticated_user_can_resend_verification_email()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to resend verification email
        $response = $this->actingAs($user, 'sanctum')->postJson('/email/resend');

        // Assert that the verification link was resent
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Verification link resent.',
            ]);
    }

    /**
     * Test that an already verified user cannot resend verification email.
     *
     * @return void
     */
    public function test_already_verified_user_cannot_resend_verification_email()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to resend verification email
        $response = $this->actingAs($user, 'sanctum')->postJson('/email/resend');

        // Assert that the user is informed that the email is already verified
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);
    }

    /**
     * Test that an authenticated user cannot change their password without providing current password.
     *
     * @return void
     */
    public function test_authenticated_user_cannot_change_password_without_current_password()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('oldpassword'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Login the user to obtain a token
        $loginResponse = $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'oldpassword',
        ]);

        $token = $loginResponse->json('access_token');

        // Define change password data without 'current_password'
        $changePasswordData = [
            // 'current_password' => 'oldpassword', // Missing
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        // Act as the user and make a POST request to change password
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/password/change', $changePasswordData);

        // Assert that the response contains validation errors for 'current_password'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('oldpassword', $user->fresh()->password));
        $this->assertFalse(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that an unauthenticated user cannot change password.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_change_password()
    {
        // Define change password data
        $changePasswordData = [
            'current_password' => 'oldpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        // Make a POST request to change password without authentication
        $response = $this->postJson('/password/change', $changePasswordData);

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401);
    }

    /**
     * Test that a user cannot register with an existing email.
     *
     * @return void
     */
    public function test_user_cannot_register_with_existing_email()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a user with a specific email
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
        ]);
        $existingUser->roles()->attach(Role::where('name', 'client')->first());

        // Define registration data with the same email
        $registrationData = [
            'username' => 'duplicateuser',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'client',
        ];

        // Act as the admin and make a POST request to register a new user with existing email
        $response = $this->actingAs($admin, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration failed due to email duplication
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test that registration fails when password and confirmation do not match.
     *
     * @return void
     */
    public function test_registration_fails_when_password_confirmation_does_not_match()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define registration data with mismatched password and confirmation
        $registrationData = [
            'username' => 'mismatchuser',
            'email' => 'mismatchuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'differentpassword',
            'role' => 'client',
        ];

        // Act as the admin and make a POST request to register a new user
        $response = $this->actingAs($admin, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration failed due to password mismatch
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test that a user cannot register without providing required fields.
     *
     * @return void
     */
    public function test_registration_fails_without_required_fields()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define incomplete registration data
        $registrationData = [
            // 'username' is missing
            'email' => 'incompleteuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            // 'role' is optional, defaults to 'client'
        ];

        // Act as the admin and make a POST request to register a new user
        $response = $this->actingAs($admin, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration failed due to missing 'username'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }
}
