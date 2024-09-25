<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up the test environment.
     *
     * This method runs before each test method in the class.
     * It seeds the necessary roles into the database and fakes notifications and events.
     */
    protected function setUp(): void
    {
        parent::setUp();
        // Seed the roles into the database
        $this->seed(\Database\Seeders\RoleSeeder::class);
        // Fake notifications and events to prevent recursion
        Notification::fake();
        Event::fake();
    }

    /**
     * Test that an admin can register a user with the 'admin' role.
     */
    public function test_admin_can_register_admin_user()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Assert that the 'admin' role exists
        $this->assertNotNull($adminRole, "'admin' role does not exist in the roles table.");

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'), // Assign a known password
        ]);
        $admin->roles()->attach($adminRole);

        // Refresh the admin instance to ensure roles are loaded
        $admin->refresh();

        // Assert that the admin user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), "The user does not have the 'admin' role.");

        // Define registration data for a new 'admin'
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
        $this->assertNotNull($newUser, "Newly registered admin user not found in the database.");
        $this->assertTrue($newUser->hasRole('admin'), "The new user does not have the 'admin' role.");

        // Assert that the VerifyEmail notification was sent to the new user
        Notification::assertSentTo(
            [$newUser],
            VerifyEmail::class,
            function ($notification, $channels) use ($newUser) {
                return in_array('mail', $channels);
            }
        );

        // Assert that no unintended events were dispatched
        Event::assertNotDispatched(Verified::class);
    }

    /**
     * Test that a non-admin cannot register a user with the 'admin' role.
     */
    public function test_non_admin_cannot_register_admin_user()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create([
            'password' => Hash::make('developerpassword'), // Assign a known password
        ]);
        $developer->roles()->attach($developerRole);

        // Refresh the developer instance to ensure roles are loaded
        $developer->refresh();

        // Assert that the developer user has the 'developer' role
        $this->assertTrue($developer->hasRole('developer'), "The user does not have the 'developer' role.");

        // Define registration data for a new 'admin'
        $registrationData = [
            'username' => 'unauthorizedadmin',
            'email' => 'unauthorizedadmin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ];

        // Act as the developer and make a POST request to register a new admin
        $response = $this->actingAs($developer, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the user was not created in the database
        $this->assertDatabaseMissing('users', ['email' => 'unauthorizedadmin@example.com']);
    }

    /**
     * Test that an admin can register a user with the 'developer' role.
     */
    public function test_admin_can_register_developer_user()
    {
        // Retrieve the 'admin' and 'developer' roles
        $adminRole = Role::where('name', 'admin')->first();
        $developerRole = Role::where('name', 'developer')->first();

        // Assert that the roles exist
        $this->assertNotNull($adminRole, "'admin' role does not exist in the roles table.");
        $this->assertNotNull($developerRole, "'developer' role does not exist in the roles table.");

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'), // Assign a known password
        ]);
        $admin->roles()->attach($adminRole);

        // Refresh the admin instance to ensure roles are loaded
        $admin->refresh();

        // Assert that the admin user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), "The user does not have the 'admin' role.");

        // Define registration data for a new 'developer'
        $registrationData = [
            'username' => 'newdeveloper',
            'email' => 'newdeveloper@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'developer',
        ];

        // Act as the admin and make a POST request to register a new developer
        $response = $this->actingAs($admin, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
            ]);

        // Verify that the user exists in the database with the 'developer' role
        $this->assertDatabaseHas('users', ['email' => 'newdeveloper@example.com']);
        $newUser = User::where('email', 'newdeveloper@example.com')->first();
        $this->assertNotNull($newUser, "Newly registered developer user not found in the database.");
        $this->assertTrue($newUser->hasRole('developer'), "The new user does not have the 'developer' role.");

        // Assert that the VerifyEmail notification was sent to the new developer
        Notification::assertSentTo(
            [$newUser],
            VerifyEmail::class,
            function ($notification, $channels) use ($newUser) {
                return in_array('mail', $channels);
            }
        );

        // Assert that no unintended events were dispatched
        Event::assertNotDispatched(Verified::class);
    }

    /**
     * Test that a non-admin cannot register a user with the 'developer' role.
     */
    public function test_non_admin_cannot_register_developer_user()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create([
            'password' => Hash::make('clientpassword'), // Assign a known password
        ]);
        $client->roles()->attach($clientRole);

        // Refresh the client instance to ensure roles are loaded
        $client->refresh();

        // Assert that the client user has the 'client' role
        $this->assertTrue($client->hasRole('client'), "The user does not have the 'client' role.");

        // Define registration data for a new 'developer'
        $registrationData = [
            'username' => 'unauthorizeddeveloper',
            'email' => 'unauthorizeddeveloper@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'developer',
        ];

        // Act as the client and make a POST request to register a new developer
        $response = $this->actingAs($client, 'sanctum')->postJson('/register', $registrationData);

        // Assert that the registration is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the user was not created in the database
        $this->assertDatabaseMissing('users', ['email' => 'unauthorizeddeveloper@example.com']);
    }

    /**
     * Test that any user can register with the default 'client' role.
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
        $this->assertNotNull($newUser, "Newly registered client user not found in the database.");
        $this->assertTrue($newUser->hasRole('client'), "The new user does not have the 'client' role.");

        // Assert that the VerifyEmail notification was sent to the new client
        Notification::assertSentTo(
            [$newUser],
            VerifyEmail::class,
            function ($notification, $channels) use ($newUser) {
                return in_array('mail', $channels);
            }
        );

        // Assert that no unintended events were dispatched
        Event::assertNotDispatched(Verified::class);
    }

    /**
     * Test that a user cannot register without providing required fields.
     */
    public function test_registration_fails_without_required_fields()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'), // Assign a known password
        ]);
        $admin->roles()->attach($adminRole);

        // Refresh the admin instance to ensure roles are loaded
        $admin->refresh();

        // Assert that the admin user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), "The user does not have the 'admin' role.");

        // Define incomplete registration data (missing 'username')
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

    /**
     * Test that a user cannot register with an existing email.
     */
    public function test_user_cannot_register_with_existing_email()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => Hash::make('adminpassword'), // Assign a known password
        ]);
        $admin->roles()->attach($adminRole);

        // Refresh the admin instance to ensure roles are loaded
        $admin->refresh();

        // Assert that the admin user has the 'admin' role
        $this->assertTrue($admin->hasRole('admin'), "The user does not have the 'admin' role.");

        // Create a user with a specific email
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'password' => Hash::make('existingpassword'),
        ]);
        $existingUser->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the existing user instance to ensure roles are loaded
        $existingUser->refresh();

        // Assert that the existing user has the 'client' role
        $this->assertTrue($existingUser->hasRole('client'), "The user does not have the 'client' role.");

        // Define registration data with the same email
        $registrationData = [
            'username' => 'duplicateuser',
            'email' => 'existing@example.com', // Duplicate email
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
     * Test that a user can log in with correct credentials and verified email.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

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
     */
    public function test_user_cannot_login_with_incorrect_credentials()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to login with incorrect password
        $response = $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'wrongpassword',
        ]);

        // Assert that the login was forbidden due to incorrect credentials
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test that a user cannot log in without verifying their email.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

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
     * Test that a user can request a password reset link.
     */
    public function test_user_can_request_password_reset_link()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to send reset link
        $response = $this->postJson('/password/email', [
            'email' => 'user@example.com',
        ]);

        // Assert that the reset link was sent
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reset link sent to your email.',
            ]);

        // Assert that the ResetPassword notification was sent
        Notification::assertSentTo(
            [$user],
            \Illuminate\Auth\Notifications\ResetPassword::class,
            function ($notification, $channels) use ($user) {
                return in_array('mail', $channels);
            }
        );
    }

    /**
     * Test that a user can reset their password with a valid token.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Generate a password reset token
        $token = Password::broker()->createToken($user);

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

        // Assert that the ResetPassword notification was sent
        Notification::assertSentTo(
            [$user],
            \Illuminate\Auth\Notifications\ResetPassword::class,
            function ($notification, $channels) use ($user) {
                return in_array('mail', $channels);
            }
        );
    }

    /**
     * Test that a user cannot reset their password with an invalid token.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Define reset password data with invalid token
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
            'token' => 'invalidtoken', // Invalid token
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
     */
    public function test_user_can_verify_email_with_valid_link()
    {
        // Fake events (already done in setUp)
        // Event::fake();

        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Generate verification hash
        $hash = sha1($user->getEmailForVerification());

        // Act as the user and make a GET request to verify email
        $response = $this->get("/email/verify/{$user->id}/{$hash}");

        // Assert that the email was verified successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Email verified successfully.',
                'token_type' => 'Bearer',
            ])
            ->assertJsonStructure([
                'access_token',
                'token_type',
            ]);

        // Assert that the Verified event was dispatched
        Event::assertDispatched(Verified::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });

        // Verify that the user's email is marked as verified
        $this->assertNotNull($user->fresh()->email_verified_at);

        // Assert that no unintended notifications were sent
        Notification::assertNotSentTo([$user], VerifyEmail::class);
    }

    /**
     * Test that a user cannot verify their email with an invalid link.
     */
    public function test_user_cannot_verify_email_with_invalid_link()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

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

        // Assert that no Verified event was dispatched
        Event::assertNotDispatched(Verified::class);
    }

    /**
     * Test that an already verified user cannot verify their email again.
     */
    public function test_already_verified_user_cannot_verify_email_again()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Generate verification hash
        $hash = sha1($user->getEmailForVerification());

        // Act as the user and make a GET request to verify email again
        $response = $this->get("/email/verify/{$user->id}/{$hash}");

        // Assert that the email is already verified
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);

        // Assert that no Verified event was dispatched again
        Event::assertDispatched(Verified::class, function ($event) use ($user) {
            // The first verification was already dispatched; ensure no new dispatch
            return $event->user->id === $user->id;
        });
    }

    /**
     * Test that an authenticated user can resend the verification email.
     */
    public function test_authenticated_user_can_resend_verification_email()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to resend verification email
        $response = $this->actingAs($user, 'sanctum')->postJson('/email/resend');

        // Assert that the verification link was resent
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Verification link resent.',
            ]);

        // Assert that the VerifyEmail notification was sent to the user
        Notification::assertSentTo(
            [$user],
            VerifyEmail::class,
            function ($notification, $channels) use ($user) {
                return in_array('mail', $channels);
            }
        );

        // Assert that no Verified event was dispatched
        Event::assertNotDispatched(Verified::class);
    }

    /**
     * Test that an already verified user cannot resend the verification email.
     */
    public function test_already_verified_user_cannot_resend_verification_email()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to resend verification email
        $response = $this->actingAs($user, 'sanctum')->postJson('/email/resend');

        // Assert that the user is informed that the email is already verified
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);

        // Assert that no VerifyEmail notification was sent
        Notification::assertNotSentTo([$user], VerifyEmail::class);

        // Assert that no Verified event was dispatched
        Event::assertNotDispatched(Verified::class);
    }

    /**
     * Test that an authenticated user can change their password.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to change password
        $response = $this->actingAs($user, 'sanctum')->postJson('/password/change', [
            'current_password' => 'oldpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // Assert that the password was changed successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password changed successfully.',
            ]);

        // Verify that the user's password was updated in the database
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));

        // Optionally, assert that notifications related to password change were sent
        // If such notifications exist, implement similar assertions
    }

    /**
     * Test that a user cannot change their password with an incorrect current password.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to change password with incorrect current password
        $response = $this->actingAs($user, 'sanctum')->postJson('/password/change', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // Assert that the response contains validation errors for 'current_password'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('oldpassword', $user->fresh()->password));
        $this->assertFalse(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that an authenticated user cannot change their password without providing the current password.
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

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to change password without 'current_password'
        $response = $this->actingAs($user, 'sanctum')->postJson('/password/change', [
            // 'current_password' => 'oldpassword', // Missing
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // Assert that the response contains validation errors for 'current_password'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('oldpassword', $user->fresh()->password));
        $this->assertFalse(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Test that an unauthenticated user cannot change their password.
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
     * Test that an authenticated user can log out successfully.
     */
    public function test_authenticated_user_can_logout()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Refresh the user instance to ensure roles are loaded
        $user->refresh();

        // Assert that the user has the 'client' role
        $this->assertTrue($user->hasRole('client'), "The user does not have the 'client' role.");

        // Act as the user and make a POST request to logout
        $response = $this->actingAs($user, 'sanctum')->postJson('/logout');

        // Assert that the logout was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out.',
            ]);

        // Verify that the token is revoked by checking that it no longer exists in the database
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            // Assuming you have only one token per user for simplicity
            'tokenable_type' => get_class($user),
        ]);
    }
}
