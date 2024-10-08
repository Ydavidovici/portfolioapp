<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\QuickBooksToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class QuickBooksTokenControllerTest extends TestCase
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
     * Helper method to create a user with a specific role and a unique API token.
     *
     * @param string $roleName
     * @return User
     */
    protected function createUserWithRoleAndToken($roleName)
    {
        $role = Role::where('name', $roleName)->firstOrFail();

        $user = User::factory()->create();
        $user->roles()->attach($role);

        // Generate a unique API token for the user
        $plainToken = Str::random(60);
        $user->api_token = hash('sha256', $plainToken);
        $user->save();

        // Store the plain token for use in the test
        $user->plainApiToken = $plainToken;

        return $user;
    }

    /**
     * Test that an admin can create a QuickBooks token.
     */
    public function test_admin_can_create_quickbooks_token()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Define QuickBooks token data
        $tokenData = [
            'access_token' => 'abc123def456',
            'refresh_token' => 'refresh123def456',
            'expires_in' => 3600,
            // 'expires_at' will be calculated in the controller
        ];

        // Act as the admin and make a POST request to create a QuickBooks token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->postJson('/quickbooks-tokens', $tokenData);

        // Assert that the token was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'QuickBooks token created successfully.',
            ])
            ->assertJsonFragment([
                'access_token' => 'abc123def456',
                'refresh_token' => 'refresh123def456',
                'expires_in' => 3600,
            ])
            ->assertJsonStructure([
                'message',
                'token' => [
                    'id',
                    'access_token',
                    'refresh_token',
                    'expires_in',
                    'expires_at',
                    'created_at',
                    'updated_at',
                ],
            ]);

        // Verify that the token exists in the database
        $this->assertDatabaseHas('quick_books_tokens', [
            'access_token' => 'abc123def456',
            'refresh_token' => 'refresh123def456',
            'expires_in' => 3600,
        ]);
    }

    /**
     * Test that a developer cannot create a QuickBooks token.
     */
    public function test_developer_cannot_create_quickbooks_token()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Define QuickBooks token data
        $tokenData = [
            'access_token' => 'dev123def456',
            'refresh_token' => 'devrefresh123def456',
            'expires_in' => 7200,
            // 'expires_at' will be calculated in the controller
        ];

        // Act as the developer and attempt to create a QuickBooks token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->postJson('/quickbooks-tokens', $tokenData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the token does not exist in the database
        $this->assertDatabaseMissing('quick_books_tokens', [
            'access_token' => 'dev123def456',
            'refresh_token' => 'devrefresh123def456',
        ]);
    }

    /**
     * Test that a client cannot create a QuickBooks token.
     */
    public function test_client_cannot_create_quickbooks_token()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Define QuickBooks token data
        $tokenData = [
            'access_token' => 'client123def456',
            'refresh_token' => 'clientrefresh123def456',
            'expires_in' => 1800,
            // 'expires_at' will be calculated in the controller
        ];

        // Act as the client and attempt to create a QuickBooks token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->postJson('/quickbooks-tokens', $tokenData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the token does not exist in the database
        $this->assertDatabaseMissing('quick_books_tokens', [
            'access_token' => 'client123def456',
            'refresh_token' => 'clientrefresh123def456',
        ]);
    }

    /**
     * Test that an admin can update any QuickBooks token.
     */
    public function test_admin_can_update_any_quickbooks_token()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'original123def456',
            'refresh_token' => 'originalrefresh123def456',
            'expires_in' => 3600,
            'expires_at' => now()->addSeconds(3600),
        ]);

        // Define updated data
        $updatedData = [
            'access_token' => 'updated123def456',
            'expires_in' => 7200,
            'refresh_token' => 'updatedrefresh123def456',
            // 'expires_at' will be recalculated in the controller
        ];

        // Act as the admin and make a PUT request to update the token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->putJson("/quickbooks-tokens/{$token->id}", $updatedData);

        // Assert that the token was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'QuickBooks token updated successfully.',
            ])
            ->assertJsonFragment([
                'id' => $token->id,
                'access_token' => 'updated123def456',
                'expires_in' => 7200,
            ])
            ->assertJsonStructure([
                'message',
                'token' => [
                    'id',
                    'access_token',
                    'refresh_token',
                    'expires_in',
                    'expires_at',
                    'created_at',
                    'updated_at',
                ],
            ]);

        // Verify that the token was updated in the database
        $this->assertDatabaseHas('quick_books_tokens', [
            'id' => $token->id,
            'access_token' => 'updated123def456',
            'expires_in' => 7200,
        ]);
    }

    /**
     * Test that a developer cannot update a QuickBooks token.
     */
    public function test_developer_cannot_update_quickbooks_token()
    {
        // Create a developer user with an API token
        $developer = $this->createUserWithRoleAndToken('developer');

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'devoriginal123def456',
            'refresh_token' => 'devoriginalrefresh123def456',
            'expires_in' => 3600,
            'expires_at' => now()->addSeconds(3600),
        ]);

        // Define updated data
        $updatedData = [
            'access_token' => 'devupdated123def456',
            'expires_in' => 7200,
            'refresh_token' => 'updatedrefresh123def456',
            // 'expires_at' will be recalculated in the controller
        ];

        // Act as the developer and attempt to update the token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $developer->plainApiToken,
        ])->putJson("/quickbooks-tokens/{$token->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the token was not updated in the database
        $this->assertDatabaseHas('quick_books_tokens', [
            'id' => $token->id,
            'access_token' => 'devoriginal123def456',
            'expires_in' => 3600,
        ]);
    }

    /**
     * Test that an admin can delete any QuickBooks token.
     */
    public function test_admin_can_delete_any_quickbooks_token()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'todelete123def456',
            'refresh_token' => 'todeleterefresh123def456',
            'expires_in' => 3600,
            'expires_at' => now()->addSeconds(3600),
        ]);

        // Act as the admin and make a DELETE request to delete the token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->deleteJson("/quickbooks-tokens/{$token->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'QuickBooks token deleted successfully.',
            ]);

        // Verify that the token no longer exists in the database
        $this->assertDatabaseMissing('quick_books_tokens', [
            'id' => $token->id,
        ]);
    }

    /**
     * Test that a client cannot delete a QuickBooks token.
     */
    public function test_client_cannot_delete_quickbooks_token()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'clienttodelete123def456',
            'refresh_token' => 'clienttodeleterefresh123def456',
            'expires_in' => 3600,
            'expires_at' => now()->addSeconds(3600),
        ]);

        // Act as the client and attempt to delete the token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->deleteJson("/quickbooks-tokens/{$token->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the token still exists in the database
        $this->assertDatabaseHas('quick_books_tokens', [
            'id' => $token->id,
            'access_token' => 'clienttodelete123def456',
        ]);
    }

    /**
     * Test that an admin can view any QuickBooks token.
     */
    public function test_admin_can_view_any_quickbooks_token()
    {
        // Create an admin user with an API token
        $admin = $this->createUserWithRoleAndToken('admin');

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'view123def456',
            'refresh_token' => 'viewrefresh123def456',
            'expires_in' => 3600,
            'expires_at' => now()->addSeconds(3600),
        ]);

        // Act as the admin and make a GET request to view the token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $admin->plainApiToken,
        ])->getJson("/quickbooks-tokens/{$token->id}");

        // Assert that the response is successful and contains the token data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $token->id,
                'access_token' => 'view123def456',
                'refresh_token' => 'viewrefresh123def456',
                'expires_in' => 3600,
            ])
            ->assertJsonStructure([
                'id',
                'access_token',
                'refresh_token',
                'expires_in',
                'expires_at',
                'created_at',
                'updated_at',
            ]);
    }

    /**
     * Test that a client cannot view any QuickBooks token.
     */
    public function test_client_cannot_view_quickbooks_token()
    {
        // Create a client user with an API token
        $client = $this->createUserWithRoleAndToken('client');

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'clientview123def456',
            'refresh_token' => 'clientviewrefresh123def456',
            'expires_in' => 3600,
            'expires_at' => now()->addSeconds(3600),
        ]);

        // Act as the client and attempt to view the token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $client->plainApiToken,
        ])->getJson("/quickbooks-tokens/{$token->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access QuickBooks tokens.
     */
    public function test_unauthenticated_user_cannot_access_quickbooks_tokens()
    {
        // Create QuickBooks tokens
        $tokens = QuickBooksToken::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/quickbooks-tokens');

        // Assert that the response is unauthorized
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
