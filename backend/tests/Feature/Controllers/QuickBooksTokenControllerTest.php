<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\QuickBooksToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuickBooksTokenControllerTest extends TestCase
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
     * Test that an admin can create a QuickBooks token.
     *
     * @return void
     */
    public function test_admin_can_create_quickbooks_token()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define QuickBooks token data
        $tokenData = [
            'access_token' => 'abc123def456',
            'refresh_token' => 'refresh123def456',
            'expires_in' => 3600,
            // Add other necessary fields as per your QuickBooksToken model
        ];

        // Act as the admin and make a POST request to create a QuickBooks token
        $response = $this->actingAs($admin)->postJson('/quickbooks-tokens', $tokenData);

        // Assert that the token was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'access_token' => 'abc123def456',
                'refresh_token' => 'refresh123def456',
                'expires_in' => 3600,
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
     *
     * @return void
     */
    public function test_developer_cannot_create_quickbooks_token()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define QuickBooks token data
        $tokenData = [
            'access_token' => 'dev123def456',
            'refresh_token' => 'devrefresh123def456',
            'expires_in' => 7200,
            // Add other necessary fields as per your QuickBooksToken model
        ];

        // Act as the developer and attempt to create a QuickBooks token
        $response = $this->actingAs($developer)->postJson('/quickbooks-tokens', $tokenData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the token does not exist in the database
        $this->assertDatabaseMissing('quick_books_tokens', [
            'access_token' => 'dev123def456',
            'refresh_token' => 'devrefresh123def456',
            'expires_in' => 7200,
        ]);
    }

    /**
     * Test that a client cannot create a QuickBooks token.
     *
     * @return void
     */
    public function test_client_cannot_create_quickbooks_token()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define QuickBooks token data
        $tokenData = [
            'access_token' => 'client123def456',
            'refresh_token' => 'clientrefresh123def456',
            'expires_in' => 1800,
            // Add other necessary fields as per your QuickBooksToken model
        ];

        // Act as the client and attempt to create a QuickBooks token
        $response = $this->actingAs($client)->postJson('/quickbooks-tokens', $tokenData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the token does not exist in the database
        $this->assertDatabaseMissing('quick_books_tokens', [
            'access_token' => 'client123def456',
            'refresh_token' => 'clientrefresh123def456',
            'expires_in' => 1800,
        ]);
    }

    /**
     * Test that an admin can update any QuickBooks token.
     *
     * @return void
     */
    public function test_admin_can_update_any_quickbooks_token()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'original123def456',
            'refresh_token' => 'originalrefresh123def456',
            'expires_in' => 3600,
        ]);

        // Define updated data
        $updatedData = [
            'access_token' => 'updated123def456',
            'expires_in' => 7200,
        ];

        // Act as the admin and make a PUT request to update the token
        $response = $this->actingAs($admin)->putJson("/quickbooks-tokens/{$token->id}", $updatedData);

        // Assert that the token was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'access_token' => 'updated123def456',
                'refresh_token' => 'originalrefresh123def456',
                'expires_in' => 7200,
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
     *
     * @return void
     */
    public function test_developer_cannot_update_quickbooks_token()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'devoriginal123def456',
            'refresh_token' => 'devoriginalrefresh123def456',
            'expires_in' => 3600,
        ]);

        // Define updated data
        $updatedData = [
            'access_token' => 'devupdated123def456',
            'expires_in' => 7200,
        ];

        // Act as the developer and attempt to update the token
        $response = $this->actingAs($developer)->putJson("/quickbooks-tokens/{$token->id}", $updatedData);

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
     *
     * @return void
     */
    public function test_admin_can_delete_any_quickbooks_token()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'todelete123def456',
            'refresh_token' => 'todeleterefresh123def456',
            'expires_in' => 3600,
        ]);

        // Act as the admin and make a DELETE request to delete the token
        $response = $this->actingAs($admin)->deleteJson("/quickbooks-tokens/{$token->id}");

        // Assert that the deletion was successful
        $response->assertStatus(204); // No Content

        // Verify that the token no longer exists in the database
        $this->assertDatabaseMissing('quick_books_tokens', [
            'id' => $token->id,
        ]);
    }

    /**
     * Test that a client cannot delete a QuickBooks token.
     *
     * @return void
     */
    public function test_client_cannot_delete_quickbooks_token()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'clienttodelete123def456',
            'refresh_token' => 'clienttodeleterefresh123def456',
            'expires_in' => 3600,
        ]);

        // Act as the client and attempt to delete the token
        $response = $this->actingAs($client)->deleteJson("/quickbooks-tokens/{$token->id}");

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
     *
     * @return void
     */
    public function test_admin_can_view_any_quickbooks_token()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'view123def456',
            'refresh_token' => 'viewrefresh123def456',
            'expires_in' => 3600,
        ]);

        // Act as the admin and make a GET request to view the token
        $response = $this->actingAs($admin)->getJson("/quickbooks-tokens/{$token->id}");

        // Assert that the response is successful and contains the token data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $token->id,
                'access_token' => 'view123def456',
                'refresh_token' => 'viewrefresh123def456',
                'expires_in' => 3600,
            ]);
    }

    /**
     * Test that a client cannot view any QuickBooks token.
     *
     * @return void
     */
    public function test_client_cannot_view_quickbooks_token()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a QuickBooks token
        $token = QuickBooksToken::factory()->create([
            'access_token' => 'clientview123def456',
            'refresh_token' => 'clientviewrefresh123def456',
            'expires_in' => 3600,
        ]);

        // Act as the client and attempt to view the token
        $response = $this->actingAs($client)->getJson("/quickbooks-tokens/{$token->id}");

        // Assert that the response is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);
    }

    /**
     * Test that an unauthenticated user cannot access QuickBooks tokens.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_quickbooks_tokens()
    {
        // Create QuickBooks tokens
        $tokens = QuickBooksToken::factory()->count(2)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/quickbooks-tokens');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
