<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;
use Illuminate\Support\Str;
use App\Mail\VerifyEmail;

class AuthControllerTest extends TestCase
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
        // Fake Mail to prevent actual emails from being sent
        Mail::fake();
        // Fake events to prevent actual event dispatching
        Event::fake();
    }

    /**
     * Helper method to authenticate a user by setting the Authorization header.
     */
    protected function authenticate(User $user)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $user->api_token,
        ]);
    }

    /**
     * Test that an admin can register a user with 'admin' role.
     */
    public function test_admin_can_register_admin_user()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $admin->roles()->attach($adminRole);

        // Authenticate as admin by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'admin',
        ]);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
                'token_type' => 'Bearer',
            ]);

        // Verify that the user exists in the database with the 'admin' role
        $this->assertDatabaseHas('users', ['email' => 'newadmin@example.com']);
        $newUser = User::where('email', 'newadmin@example.com')->first();
        $this->assertNotNull($newUser);
        $this->assertTrue($newUser->hasRole('admin'));

        // Assert that a verification email was sent to the new admin
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($newUser) {
            return $mail->hasTo($newUser->email);
        });
    }

    /**
     * Test that a non-admin cannot register a user with 'admin' role.
     */
    public function test_non_admin_cannot_register_admin_user()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $developer->roles()->attach($developerRole);

        // Authenticate as developer by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            'username' => 'unauthorizedadmin',
            'email' => 'unauthorizedadmin@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'admin',
        ]);

        // Assert that the registration is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
            ]);

        // Verify that the user was not created in the database
        $this->assertDatabaseMissing('users', ['email' => 'unauthorizedadmin@example.com']);
    }

    /**
     * Test that an admin can register a user with 'developer' role.
     */
    public function test_admin_can_register_developer_user()
    {
        // Retrieve the 'admin' and 'developer' roles
        $adminRole = Role::where('name', 'admin')->first();
        $developerRole = Role::where('name', 'developer')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $admin->roles()->attach($adminRole);

        // Authenticate as admin by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            'username' => 'newdeveloper',
            'email' => 'newdeveloper@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'developer',
        ]);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
                'token_type' => 'Bearer',
            ]);

        // Verify that the user exists in the database with the 'developer' role
        $this->assertDatabaseHas('users', ['email' => 'newdeveloper@example.com']);
        $newUser = User::where('email', 'newdeveloper@example.com')->first();
        $this->assertNotNull($newUser);
        $this->assertTrue($newUser->hasRole('developer'));

        // Assert that a verification email was sent to the new developer
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($newUser) {
            return $mail->hasTo($newUser->email);
        });
    }

    /**
     * Test that a non-admin cannot register a user with 'developer' role.
     */
    public function test_non_admin_cannot_register_developer_user()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $client->roles()->attach($clientRole);

        // Authenticate as client by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            'username' => 'unauthorizeddeveloper',
            'email' => 'unauthorizeddeveloper@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'developer',
        ]);

        // Assert that the registration is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
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
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            // 'role' is omitted to default to 'client'
        ];

        // Make a POST request to register a new client
        $response = $this->postJson('/register', $registrationData);

        // Assert that the registration was successful
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
                'token_type' => 'Bearer',
            ]);

        // Verify that the user exists in the database with the 'client' role
        $this->assertDatabaseHas('users', ['email' => 'guestclient@example.com']);
        $newUser = User::where('email', 'guestclient@example.com')->first();
        $this->assertNotNull($newUser);
        $this->assertTrue($newUser->hasRole('client'));

        // Assert that a verification email was sent to the new client
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($newUser) {
            return $mail->hasTo($newUser->email);
        });
    }

    /**
     * Test that registration fails when required fields are missing.
     */
    public function test_registration_fails_when_required_fields_are_missing()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $admin->roles()->attach($adminRole);

        // Authenticate as admin by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            // 'username' is missing
            // 'email' is missing
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'client',
        ]);

        // Assert that the registration failed due to missing 'username' and 'email'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username', 'email']);
    }

    /**
     * Test that a user cannot register with an existing email.
     */
    public function test_user_cannot_register_with_existing_email()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $admin->roles()->attach($adminRole);

        // Create a user with a specific email
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
        ]);
        $existingUser->roles()->attach(Role::where('name', 'client')->first());

        // Authenticate as admin by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            'username' => 'duplicateuser',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'client',
        ]);

        // Assert that the registration failed due to email duplication
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Optionally, assert the error message
        $response->assertJsonFragment([
            'email' => ['The email has already been taken.'],
        ]);
    }

    /**
     * Test that a user can log in with correct credentials and verified email.
     */
    public function test_user_can_login_with_correct_credentials_and_verified_email()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'verifieduser@example.com',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to login
        $response = $this->postJson('/login', [
            'email' => 'verifieduser@example.com',
            'password' => 'Password123!',
        ]);

        // Assert that the login was successful and token is returned
        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'token_type' => 'Bearer',
            ]);

        // Verify that the token was updated in the database
        $user->refresh();
        $this->assertNotNull($user->api_token);
    }

    /**
     * Test that a user cannot log in with incorrect credentials.
     */
    public function test_user_cannot_login_with_incorrect_credentials()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to login with incorrect password
        $response = $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'WrongPassword!',
        ]);

        // Assert that the login was forbidden due to incorrect credentials
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Optionally, assert the error message
        $response->assertJsonFragment([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Test that a user cannot log in without verifying their email.
     */
    public function test_user_cannot_login_without_verifying_email()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'unverifieduser@example.com',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => null,
            'api_token' => hash('sha256', Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user and make a POST request to login
        $response = $this->postJson('/login', [
            'email' => 'unverifieduser@example.com',
            'password' => 'Password123!',
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

        // Act as the user and make a POST request to send reset link
        $response = $this->postJson('/password/email', [
            'email' => 'user@example.com',
        ]);

        // Assert that the reset link was sent
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reset link sent to your email.',
            ]);

        // Assert that a password reset token was created in the database
        $this->assertDatabaseHas('password_resets', [
            'email' => 'user@example.com',
        ]);

        // Optionally, assert that a password reset email was sent
        Mail::assertSent(\Illuminate\Auth\Notifications\ResetPassword::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /**
     * Test that a user can reset their password with a valid token.
     */
    public function test_user_can_reset_password_with_valid_token()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('OldPassword123!'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate a password reset token
        $token = Password::broker()->createToken($user);

        // Define reset password data
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
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
        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));

        // Optionally, assert that the API token was invalidated
        $this->assertNull($user->fresh()->api_token);
    }

    /**
     * Test that a user cannot reset their password with an invalid token.
     */
    public function test_user_cannot_reset_password_with_invalid_token()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('OldPassword123!'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Define reset password data with invalid token
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
            'token' => 'invalidtoken',
        ];

        // Act as the user and make a POST request to reset password
        $response = $this->postJson('/password/reset', $resetPasswordData);

        // Assert that the response contains validation errors for 'email'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Optionally, assert the error message
        $response->assertJsonFragment([
            'email' => ['The provided token is invalid.'],
        ]);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('OldPassword123!', $user->fresh()->password));
        $this->assertFalse(Hash::check('NewPassword123!', $user->fresh()->password));
    }

    /**
     * Test that a user can verify their email with a valid link.
     */
    public function test_user_can_verify_email_with_valid_link()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate verification hash
        $hash = sha1($user->getEmailForVerification());

        // Act as the user and make a GET request to verify email
        $response = $this->getJson("/email/verify/{$user->id}/{$hash}");

        // Assert that the email was verified successfully
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message' => 'Email verified successfully.',
                'token_type' => 'Bearer',
            ]);

        // Assert that the event was dispatched
        Event::assertDispatched(Verified::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });

        // Verify that the user's email is marked as verified
        $this->assertNotNull($user->fresh()->email_verified_at);

        // Verify that a new API token was generated
        $this->assertNotNull($user->fresh()->api_token);
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

        // Generate invalid verification hash
        $invalidHash = sha1('invalidemail@example.com');

        // Act as the user and make a GET request to verify email with invalid hash
        $response = $this->getJson("/email/verify/{$user->id}/{$invalidHash}");

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
     */
    public function test_already_verified_user_cannot_verify_email_again()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => now(),
            'api_token' => hash('sha256', Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Generate verification hash
        $hash = sha1($user->getEmailForVerification());

        // Act as the user and make a GET request to verify email again
        $response = $this->getJson("/email/verify/{$user->id}/{$hash}");

        // Assert that the email is already verified
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);
    }

    /**
     * Test that an authenticated user can resend verification email.
     */
    public function test_authenticated_user_can_resend_verification_email()
    {
        // Create a user without verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => null,
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/email/resend');

        // Assert that the verification link was resent
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Verification link resent.',
            ]);

        // Assert that a new verification email was sent
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /**
     * Test that an already verified user cannot resend verification email.
     */
    public function test_already_verified_user_cannot_resend_verification_email()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'email_verified_at' => now(),
            'api_token' => hash('sha256', Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $user->api_token,
        ])->postJson('/email/resend');

        // Assert that the user is informed that the email is already verified
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);

        // Assert that no verification email was sent
        Mail::assertNotSent(VerifyEmail::class);
    }

    /**
     * Test that an authenticated user can change their password.
     */
    public function test_authenticated_user_can_change_password()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('OldPassword123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/password/change', [
            'current_password' => 'OldPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        // Assert that the password was changed successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password changed successfully.',
            ]);

        // Verify that the user's password was updated in the database
        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));

        // Verify that the API token was invalidated
        $this->assertNull($user->fresh()->api_token);
    }

    /**
     * Test that a user cannot change their password with incorrect current password.
     */
    public function test_user_cannot_change_password_with_incorrect_current_password()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('OldPassword123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/password/change', [
            'current_password' => 'WrongPassword!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        // Assert that the response contains validation errors for 'current_password'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Optionally, assert the error message
        $response->assertJsonFragment([
            'current_password' => ['The current password is incorrect.'],
        ]);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('OldPassword123!', $user->fresh()->password));
        $this->assertFalse(Hash::check('NewPassword123!', $user->fresh()->password));

        // Verify that the API token remains intact
        $this->assertNotNull($user->fresh()->api_token);
    }

    /**
     * Test that an authenticated user cannot change password without providing current password.
     */
    public function test_authenticated_user_cannot_change_password_without_current_password()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('OldPassword123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/password/change', [
            // 'current_password' => 'OldPassword123!', // Missing
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        // Assert that the response contains validation errors for 'current_password'
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);

        // Optionally, assert the error message
        $response->assertJsonFragment([
            'current_password' => ['The current password field is required.'],
        ]);

        // Verify that the user's password was not changed in the database
        $this->assertTrue(Hash::check('OldPassword123!', $user->fresh()->password));
        $this->assertFalse(Hash::check('NewPassword123!', $user->fresh()->password));

        // Verify that the API token remains intact
        $this->assertNotNull($user->fresh()->api_token);
    }

    /**
     * Test that an unauthenticated user cannot change password.
     */
    public function test_unauthenticated_user_cannot_change_password()
    {
        // Define change password data
        $changePasswordData = [
            'current_password' => 'OldPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ];

        // Make a POST request to change password without authentication
        $response = $this->postJson('/password/change', $changePasswordData);

        // Assert that the response status is 401 Unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test that an authenticated user can log out successfully.
     */
    public function test_authenticated_user_can_logout()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Act as the user by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/logout');

        // Assert that the logout was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out.',
            ]);

        // Verify that the user's API token was invalidated
        $this->assertNull($user->fresh()->api_token);
    }

    /**
     * Test that a user cannot register with a non-existent role.
     */
    public function test_user_cannot_register_with_non_existent_role()
    {
        // Create an admin user and assign the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $admin->roles()->attach($adminRole);

        // Authenticate as admin by setting the Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/register', [
            'username' => 'invalidroleuser',
            'email' => 'invalidroleuser@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'superadmin', // Assuming 'superadmin' does not exist
        ]);

        // Assert that the registration defaults to 'client' role
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message' => 'Registration successful. Please check your email to verify your account.',
                'token_type' => 'Bearer',
            ]);

        // Verify that the user exists in the database with the 'client' role
        $this->assertDatabaseHas('users', ['email' => 'invalidroleuser@example.com']);
        $newUser = User::where('email', 'invalidroleuser@example.com')->first();
        $this->assertNotNull($newUser);
        $this->assertTrue($newUser->hasRole('client'));

        // Assert that a verification email was sent to the new user
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($newUser) {
            return $mail->hasTo($newUser->email);
        });
    }

    /**
     * Test that password reset link cannot be requested too frequently (rate limiting).
     */
    public function test_password_reset_link_is_rate_limited()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'user@example.com',
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Simulate multiple rapid requests to send reset link
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/password/email', [
                'email' => 'user@example.com',
            ]);

            $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Reset link sent to your email.',
                ]);
        }

        // Sixth request should be rate limited
        $response = $this->postJson('/password/email', [
            'email' => 'user@example.com',
        ]);

        $response->assertStatus(429)
            ->assertJson([
                'message' => 'Too many requests. Please try again later.',
            ]);
    }

    /**
     * Test that login is rate limited after too many attempts.
     */
    public function test_login_is_rate_limited_after_too_many_attempts()
    {
        // Create a user with verified email
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('Password123!'),
            'email_verified_at' => now(),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Attempt to login with incorrect password multiple times
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/login', [
                'email' => 'user@example.com',
                'password' => 'WrongPassword!',
            ]);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        }

        // Sixth attempt should be rate limited
        $response = $this->postJson('/login', [
            'email' => 'user@example.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(429)
            ->assertJson([
                'message' => 'Too many login attempts. Please try again later.',
            ]);
    }

    /**
     * Test that tokens are correctly revoked after password reset.
     */
    public function test_tokens_are_revoked_after_password_reset()
    {
        // Create a user with verified email and an API token
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('OldPassword123!'),
            'email_verified_at' => now(),
            'api_token' => hash('sha256', $token = Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Ensure the token exists
        $this->assertNotNull($user->api_token);

        // Generate a password reset token
        $passwordResetToken = Password::broker()->createToken($user);

        // Reset the password
        $response = $this->postJson('/password/reset', [
            'email' => 'user@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
            'token' => $passwordResetToken,
        ]);

        // Assert password reset was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password has been reset.',
            ]);

        // Verify that the API token was invalidated
        $this->assertNull($user->fresh()->api_token);

        // Attempt to use the old token to access a protected route
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/protected-route'); // Replace with an actual protected route

        // Assert that access is denied
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
