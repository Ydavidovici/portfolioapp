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
use Illuminate\Auth\Notifications\ResetPassword;

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
     * Helper method to create and authenticate a user.
     *
     * @param string $roleName
     * @return array Returns an array containing the User model and the raw API token.
     */
    protected function createAndAuthenticateUser(string $roleName = 'client'): array
    {
        // Retrieve the specified role
        $role = Role::where('name', $roleName)->firstOrFail();

        // Generate a raw API token
        $rawToken = Str::random(60);

        // Create the user and assign the role
        $user = User::factory()->create([
            'api_token' => hash('sha256', $rawToken),
        ]);
        $user->roles()->attach($role);

        return ['user' => $user, 'token' => $rawToken];
    }

    /**
     * Test that an admin can register a user with the 'admin' role.
     */
    public function test_admin_can_register_admin_user()
    {
        // Create and authenticate an admin user
        $auth = $this->createAndAuthenticateUser('admin');
        $admin = $auth['user'];
        $rawToken = $auth['token'];

        // Define registration data for a new admin user
        $registrationData = [
            'username' => 'newadmin',
            'email'    => 'newadmin@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'admin',
        ];

        // Make a POST request to register the new admin user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 201 Created
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message'      => 'Registration successful. Please check your email to verify your account.',
                'token_type'   => 'Bearer',
            ]);

        // Assert that the new user exists in the database with the 'admin' role
        $this->assertDatabaseHas('users', [
            'email'    => 'newadmin@example.com',
            'username' => 'newadmin',
        ]);

        $newUser = User::where('email', 'newadmin@example.com')->first();
        $this->assertNotNull($newUser, 'The new admin user was not found in the database.');
        $this->assertTrue($newUser->hasRole('admin'), 'The new user does not have the admin role.');

        // Assert that a verification email was sent to the new admin
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($newUser) {
            return $mail->hasTo($newUser->email);
        });
    }

    /**
     * Test that a non-admin user cannot register a user with the 'admin' role.
     */
    public function test_non_admin_cannot_register_admin_user()
    {
        // Create and authenticate a non-admin user (e.g., developer)
        $auth = $this->createAndAuthenticateUser('developer');
        $developer = $auth['user'];
        $rawToken = $auth['token'];

        // Define registration data attempting to assign the 'admin' role
        $registrationData = [
            'username' => 'unauthorizedadmin',
            'email'    => 'unauthorizedadmin@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'admin',
        ];

        // Make a POST request to register the new admin user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
            ]);

        // Assert that the user was not created in the database
        $this->assertDatabaseMissing('users', [
            'email'    => 'unauthorizedadmin@example.com',
            'username' => 'unauthorizedadmin',
        ]);

        // Assert that no verification email was sent
        Mail::assertNothingSent();
    }

    /**
     * Test that an admin can register a user with the 'developer' role.
     */
    public function test_admin_can_register_developer_user()
    {
        // Create and authenticate an admin user
        $auth = $this->createAndAuthenticateUser('admin');
        $admin = $auth['user'];
        $rawToken = $auth['token'];

        // Define registration data for a new developer user
        $registrationData = [
            'username' => 'newdeveloper',
            'email'    => 'newdeveloper@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'developer',
        ];

        // Make a POST request to register the new developer user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 201 Created
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message'      => 'Registration successful. Please check your email to verify your account.',
                'token_type'   => 'Bearer',
            ]);

        // Assert that the new user exists in the database with the 'developer' role
        $this->assertDatabaseHas('users', [
            'email'    => 'newdeveloper@example.com',
            'username' => 'newdeveloper',
        ]);

        $newUser = User::where('email', 'newdeveloper@example.com')->first();
        $this->assertNotNull($newUser, 'The new developer user was not found in the database.');
        $this->assertTrue($newUser->hasRole('developer'), 'The new user does not have the developer role.');

        // Assert that a verification email was sent to the new developer
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($newUser) {
            return $mail->hasTo($newUser->email);
        });
    }

    /**
     * Test that a non-admin user cannot register a user with the 'developer' role.
     */
    public function test_non_admin_cannot_register_developer_user()
    {
        // Create and authenticate a non-admin user (e.g., client)
        $auth = $this->createAndAuthenticateUser('client');
        $client = $auth['user'];
        $rawToken = $auth['token'];

        // Define registration data attempting to assign the 'developer' role
        $registrationData = [
            'username' => 'unauthorizeddeveloper',
            'email'    => 'unauthorizeddeveloper@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'developer',
        ];

        // Make a POST request to register the new developer user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 403 Forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized.',
            ]);

        // Assert that the user was not created in the database
        $this->assertDatabaseMissing('users', [
            'email'    => 'unauthorizeddeveloper@example.com',
            'username' => 'unauthorizeddeveloper',
        ]);

        // Assert that no verification email was sent
        Mail::assertNothingSent();
    }

    /**
     * Test that a user can register with the default 'client' role.
     */
    public function test_user_can_register_client_user()
    {
        // Define registration data without specifying a role (defaults to 'client')
        $registrationData = [
            'username' => 'guestclient',
            'email'    => 'guestclient@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            // 'role' is omitted to default to 'client'
        ];

        // Make a POST request to register a new client user
        $response = $this->postJson('/register', $registrationData);

        // Assert that the response status is 201 Created
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message'      => 'Registration successful. Please check your email to verify your account.',
                'token_type'   => 'Bearer',
            ]);

        // Assert that the new user exists in the database with the 'client' role
        $this->assertDatabaseHas('users', [
            'email'    => 'guestclient@example.com',
            'username' => 'guestclient',
        ]);

        $newUser = User::where('email', 'guestclient@example.com')->first();
        $this->assertNotNull($newUser, 'The new client user was not found in the database.');
        $this->assertTrue($newUser->hasRole('client'), 'The new user does not have the client role.');

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
        // Create and authenticate an admin user
        $auth = $this->createAndAuthenticateUser('admin');
        $admin = $auth['user'];
        $rawToken = $auth['token'];

        // Define incomplete registration data (missing 'username' and 'email')
        $registrationData = [
            // 'username' is missing
            // 'email' is missing
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'client',
        ];

        // Make a POST request to register the user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 422 Unprocessable Entity
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username', 'email']);
    }

    /**
     * Test that a user cannot register with an existing email.
     */
    public function test_user_cannot_register_with_existing_email()
    {
        // Create and authenticate an admin user
        $auth = $this->createAndAuthenticateUser('admin');
        $admin = $auth['user'];
        $rawToken = $auth['token'];

        // Create a user with a specific email
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
        ]);
        $existingUser->roles()->attach(Role::where('name', 'client')->first());

        // Define registration data with the existing email
        $registrationData = [
            'username' => 'duplicateuser',
            'email'    => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'client',
        ];

        // Make a POST request to register the user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 422 Unprocessable Entity
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
            'api_token' => hash('sha256', Str::random(60)),
        ]);
        $user->roles()->attach(Role::where('name', 'client')->first());

        // Define login credentials
        $loginData = [
            'email' => 'verifieduser@example.com',
            'password' => 'Password123!',
        ];

        // Make a POST request to login
        $response = $this->postJson('/login', $loginData);

        // Assert that the response status is 200 OK
        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'token_type' => 'Bearer',
            ]);

        // Assert that the API token was updated in the database
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

        // Define incorrect login credentials
        $loginData = [
            'email' => 'user@example.com',
            'password' => 'WrongPassword!',
        ];

        // Make a POST request to login
        $response = $this->postJson('/login', $loginData);

        // Assert that the response status is 422 Unprocessable Entity
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

        // Define login credentials
        $loginData = [
            'email' => 'unverifieduser@example.com',
            'password' => 'Password123!',
        ];

        // Make a POST request to login
        $response = $this->postJson('/login', $loginData);

        // Assert that the response status is 403 Forbidden
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

        // Define password reset request data
        $resetRequestData = [
            'email' => 'user@example.com',
        ];

        // Make a POST request to send the password reset link
        $response = $this->postJson('/password/email', $resetRequestData);

        // Assert that the response status is 200 OK
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reset link sent to your email.',
            ]);

        // Assert that a password reset token was created in the database
        $this->assertDatabaseHas('password_resets', [
            'email' => 'user@example.com',
        ]);

        // Assert that a password reset email was sent
        Mail::assertSent(ResetPassword::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /**
     * Test that a user can reset their password with a valid token.
     */
    public function test_user_can_reset_password_with_valid_token()
    {
        // Create a user with verified email
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

        // Make a POST request to reset password
        $response = $this->postJson('/password/reset', $resetPasswordData);

        // Assert that the response status is 200 OK
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password has been reset.',
            ]);

        // Verify that the user's password was updated in the database
        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));

        // Assert that the API token was invalidated
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

        // Define reset password data with an invalid token
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
            'token' => 'invalidtoken',
        ];

        // Make a POST request to reset password
        $response = $this->postJson('/password/reset', $resetPasswordData);

        // Assert that the response status is 422 Unprocessable Entity
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

        // Make a GET request to verify email
        $response = $this->getJson("/email/verify/{$user->id}/{$hash}");

        // Assert that the response status is 200 OK
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
            ])
            ->assertJson([
                'message'      => 'Email verified successfully.',
                'token_type'   => 'Bearer',
            ]);

        // Assert that the Verified event was dispatched
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

        // Generate an invalid verification hash
        $invalidHash = sha1('invalidemail@example.com');

        // Make a GET request to verify email with invalid hash
        $response = $this->getJson("/email/verify/{$user->id}/{$invalidHash}");

        // Assert that the response status is 400 Bad Request
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

        // Make a GET request to verify email again
        $response = $this->getJson("/email/verify/{$user->id}/{$hash}");

        // Assert that the response status is 400 Bad Request
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
        // Create and authenticate a user without verified email
        $auth = $this->createAndAuthenticateUser('client');
        $user = $auth['user'];
        $rawToken = $auth['token'];

        // Make a POST request to resend the verification email
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/email/resend');

        // Assert that the response status is 200 OK
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Verification link resent.',
            ]);

        // Assert that a verification email was sent
        Mail::assertSent(VerifyEmail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /**
     * Test that an already verified user cannot resend verification email.
     */
    public function test_already_verified_user_cannot_resend_verification_email()
    {
        // Create and authenticate a user with verified email
        $auth = $this->createAndAuthenticateUser('client');
        $user = $auth['user'];
        $rawToken = $auth['token'];

        // Manually mark the user's email as verified
        $user->markEmailAsVerified();

        // Make a POST request to resend the verification email
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/email/resend');

        // Assert that the response status is 400 Bad Request
        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified.',
            ]);

        // Assert that no verification email was sent
        Mail::assertNothingSent();
    }

    /**
     * Test that an authenticated user can change their password.
     */
    public function test_authenticated_user_can_change_password()
    {
        // Create and authenticate a user
        $auth = $this->createAndAuthenticateUser('client');
        $user = $auth['user'];
        $rawToken = $auth['token'];

        // Define change password data
        $changePasswordData = [
            'current_password' => 'OldPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ];

        // Manually set the user's password to 'OldPassword123!' for testing
        $user->password = Hash::make('OldPassword123!');
        $user->save();

        // Make a POST request to change the password
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/password/change', $changePasswordData);

        // Assert that the response status is 200 OK
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
        // Create and authenticate a user
        $auth = $this->createAndAuthenticateUser('client');
        $user = $auth['user'];
        $rawToken = $auth['token'];

        // Define change password data with incorrect current password
        $changePasswordData = [
            'current_password' => 'WrongPassword!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ];

        // Manually set the user's password to 'OldPassword123!' for testing
        $user->password = Hash::make('OldPassword123!');
        $user->save();

        // Make a POST request to change the password
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/password/change', $changePasswordData);

        // Assert that the response status is 422 Unprocessable Entity
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
        // Create and authenticate a user
        $auth = $this->createAndAuthenticateUser('client');
        $user = $auth['user'];
        $rawToken = $auth['token'];

        // Define change password data without 'current_password'
        $changePasswordData = [
            // 'current_password' => 'OldPassword123!', // Missing
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ];

        // Make a POST request to change the password
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/password/change', $changePasswordData);

        // Assert that the response status is 422 Unprocessable Entity
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
        // Create and authenticate a user
        $auth = $this->createAndAuthenticateUser('client');
        $user = $auth['user'];
        $rawToken = $auth['token'];

        // Make a POST request to logout
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/logout');

        // Assert that the response status is 200 OK
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
        // Create and authenticate an admin user
        $auth = $this->createAndAuthenticateUser('admin');
        $admin = $auth['user'];
        $rawToken = $auth['token'];

        // Define registration data with a non-existent role 'superadmin'
        $registrationData = [
            'username' => 'invalidroleuser',
            'email'    => 'invalidroleuser@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role'    => 'superadmin', // Assuming 'superadmin' does not exist
        ];

        // Make a POST request to register the user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $rawToken,
        ])->postJson('/register', $registrationData);

        // Assert that the response status is 404 Not Found
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Role not found.',
            ]);

        // Assert that the user was not created in the database
        $this->assertDatabaseMissing('users', [
            'email'    => 'invalidroleuser@example.com',
            'username' => 'invalidroleuser',
        ]);

        // Assert that no verification email was sent
        Mail::assertNothingSent();
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

        // Define password reset request data
        $resetRequestData = [
            'email' => 'user@example.com',
        ];

        // Simulate multiple rapid requests to send reset link
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/password/email', $resetRequestData);

            $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Reset link sent to your email.',
                ]);
        }

        // Sixth request should be rate limited (assuming limit is 5)
        $response = $this->postJson('/password/email', $resetRequestData);

        // Assert that the response status is 429 Too Many Requests
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

        // Define incorrect login credentials
        $loginData = [
            'email' => 'user@example.com',
            'password' => 'WrongPassword!',
        ];

        // Attempt to login with incorrect password multiple times
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/login', $loginData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        }

        // Sixth attempt should be rate limited
        $response = $this->postJson('/login', $loginData);

        // Assert that the response status is 429 Too Many Requests
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

        // Define reset password data
        $resetPasswordData = [
            'email' => 'user@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
            'token' => $passwordResetToken,
        ];

        // Reset the password
        $response = $this->postJson('/password/reset', $resetPasswordData);

        // Assert password reset was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password has been reset.',
            ]);

        // Verify that the API token was invalidated
        $this->assertNull($user->fresh()->api_token);

        // Attempt to use the old token to access a protected route
        // For demonstration, assuming '/protected-route' exists and is protected
        // Replace '/protected-route' with an actual protected route in your application
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
