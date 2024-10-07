<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Checklist;
use App\Models\ChecklistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ChecklistItemControllerTest extends TestCase
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
     * Authenticate a user and return headers with the Bearer token.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    protected function authenticate(User $user)
    {
        $token = Str::random(60);
        $user->api_token = hash('sha256', $token);
        $user->save();

        return [
            'Authorization' => 'Bearer ' . $token,
        ];
    }

    /**
     * Test that an admin can create a checklist item.
     */
    public function test_admin_can_create_checklist_item()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $checklist = Checklist::factory()->create();

        $checklistItemData = [
            'description' => 'Admin Checklist Item',
            'is_completed' => false,
            'checklist_id' => $checklist->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->postJson('/checklist-items', $checklistItemData);

        // Assert
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Checklist item created successfully.',
                'checklist_item' => [
                    'description' => 'Admin Checklist Item',
                    'is_completed' => false,
                    'checklist_id' => $checklist->id,
                ],
            ]);

        $this->assertDatabaseHas('checklist_items', [
            'description' => 'Admin Checklist Item',
            'is_completed' => false,
            'checklist_id' => $checklist->id,
        ]);
    }

    /**
     * Test that a developer can create a checklist item.
     */
    public function test_developer_can_create_checklist_item()
    {
        // Arrange
        $developerRole = Role::where('name', 'developer')->first();
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Authenticate the developer and get headers
        $headers = $this->authenticate($developer);

        $checklist = Checklist::factory()->create();

        $checklistItemData = [
            'description' => 'Developer Checklist Item',
            'is_completed' => true,
            'checklist_id' => $checklist->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->postJson('/checklist-items', $checklistItemData);

        // Assert
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Checklist item created successfully.',
                'checklist_item' => [
                    'description' => 'Developer Checklist Item',
                    'is_completed' => true,
                    'checklist_id' => $checklist->id,
                ],
            ]);

        $this->assertDatabaseHas('checklist_items', [
            'description' => 'Developer Checklist Item',
            'is_completed' => true,
            'checklist_id' => $checklist->id,
        ]);
    }

    /**
     * Test that a client cannot create a checklist item.
     */
    public function test_client_cannot_create_checklist_item()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        $checklist = Checklist::factory()->create();

        $checklistItemData = [
            'description' => 'Client Checklist Item',
            'is_completed' => false,
            'checklist_id' => $checklist->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->postJson('/checklist-items', $checklistItemData);

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        $this->assertDatabaseMissing('checklist_items', [
            'description' => 'Client Checklist Item',
            'checklist_id' => $checklist->id,
        ]);
    }

    /**
     * Test that any authenticated user can view checklist items.
     */
    public function test_any_authenticated_user_can_view_checklist_items()
    {
        // Arrange
        $roles = ['admin', 'developer', 'client'];

        $users = collect($roles)->map(function ($roleName) {
            $role = Role::where('name', $roleName)->first();
            $user = User::factory()->create();
            $user->roles()->attach($role);
            // Authenticate the user and store headers
            $user->headers = $this->authenticate($user);
            return $user;
        });

        $checklistItems = ChecklistItem::factory()->count(3)->create();

        // Act & Assert
        $users->each(function ($user) use ($checklistItems) {
            $response = $this->withHeaders($user->headers)->getJson('/checklist-items');

            $response->assertStatus(200)
                ->assertJsonCount(3);

            $checklistItems->each(function ($item) use ($response) {
                $response->assertJsonFragment([
                    'id' => $item->id,
                    'description' => $item->description,
                    'is_completed' => $item->is_completed,
                    'checklist_id' => $item->checklist_id,
                ]);
            });
        });
    }

    /**
     * Test that an unauthenticated user cannot view checklist items.
     */
    public function test_unauthenticated_user_cannot_view_checklist_items()
    {
        // Arrange
        $checklistItems = ChecklistItem::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/checklist-items');

        // Assert
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test that an admin can update a checklist item.
     */
    public function test_admin_can_update_checklist_item()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $checklistItem = ChecklistItem::factory()->create([
            'description' => 'Original Description',
            'is_completed' => false,
        ]);

        $updatedData = [
            'description' => 'Updated Description',
            'is_completed' => true,
            'checklist_id' => $checklistItem->checklist_id,
        ];

        // Act
        $response = $this->withHeaders($headers)->putJson("/checklist-items/{$checklistItem->id}", $updatedData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item updated successfully.',
                'checklist_item' => [
                    'id' => $checklistItem->id,
                    'description' => 'Updated Description',
                    'is_completed' => true,
                    'checklist_id' => $checklistItem->checklist_id,
                ],
            ]);

        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
            'description' => 'Updated Description',
            'is_completed' => true,
        ]);
    }

    /**
     * Test that a developer can update a checklist item.
     */
    public function test_developer_can_update_checklist_item()
    {
        // Arrange
        $developerRole = Role::where('name', 'developer')->first();
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Authenticate the developer and get headers
        $headers = $this->authenticate($developer);

        $checklistItem = ChecklistItem::factory()->create([
            'description' => 'Original Description',
            'is_completed' => false,
        ]);

        $updatedData = [
            'description' => 'Updated by Developer',
            'is_completed' => true,
            'checklist_id' => $checklistItem->checklist_id,
        ];

        // Act
        $response = $this->withHeaders($headers)->putJson("/checklist-items/{$checklistItem->id}", $updatedData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item updated successfully.',
                'checklist_item' => [
                    'id' => $checklistItem->id,
                    'description' => 'Updated by Developer',
                    'is_completed' => true,
                    'checklist_id' => $checklistItem->checklist_id,
                ],
            ]);

        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
            'description' => 'Updated by Developer',
            'is_completed' => true,
        ]);
    }

    /**
     * Test that a client cannot update a checklist item.
     */
    public function test_client_cannot_update_checklist_item()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        $checklistItem = ChecklistItem::factory()->create([
            'description' => 'Client Original Description',
            'is_completed' => false,
        ]);

        $updatedData = [
            'description' => 'Attempted Update by Client',
            'is_completed' => true,
            'checklist_id' => $checklistItem->checklist_id,
        ];

        // Act
        $response = $this->withHeaders($headers)->putJson("/checklist-items/{$checklistItem->id}", $updatedData);

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
            'description' => 'Client Original Description',
            'is_completed' => false,
        ]);
    }

    /**
     * Test that an admin can delete a checklist item.
     */
    public function test_admin_can_delete_checklist_item()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $checklistItem = ChecklistItem::factory()->create();

        // Act
        $response = $this->withHeaders($headers)->deleteJson("/checklist-items/{$checklistItem->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item deleted successfully.',
            ]);

        $this->assertDatabaseMissing('checklist_items', [
            'id' => $checklistItem->id,
        ]);
    }

    /**
     * Test that a developer can delete a checklist item.
     */
    public function test_developer_can_delete_checklist_item()
    {
        // Arrange
        $developerRole = Role::where('name', 'developer')->first();
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Authenticate the developer and get headers
        $headers = $this->authenticate($developer);

        $checklistItem = ChecklistItem::factory()->create();

        // Act
        $response = $this->withHeaders($headers)->deleteJson("/checklist-items/{$checklistItem->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item deleted successfully.',
            ]);

        $this->assertDatabaseMissing('checklist_items', [
            'id' => $checklistItem->id,
        ]);
    }

    /**
     * Test that a client cannot delete a checklist item.
     */
    public function test_client_cannot_delete_checklist_item()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        $checklistItem = ChecklistItem::factory()->create();

        // Act
        $response = $this->withHeaders($headers)->deleteJson("/checklist-items/{$checklistItem->id}");

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
        ]);
    }

    /**
     * Test that a user cannot create a checklist item without required fields.
     */
    public function test_cannot_create_checklist_item_without_required_fields()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $checklistItemData = []; // Missing required fields

        // Act
        $response = $this->withHeaders($headers)->postJson('/checklist-items', $checklistItemData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['description', 'checklist_id']);
    }

    /**
     * Test that a user cannot update a checklist item with invalid data.
     */
    public function test_cannot_update_checklist_item_with_invalid_data()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $checklistItem = ChecklistItem::factory()->create();

        $updatedData = [
            'description' => '', // Invalid: empty string
            'is_completed' => 'not a boolean', // Invalid: not a boolean
            'checklist_id' => 9999, // Assuming this ID does not exist
        ];

        // Act
        $response = $this->withHeaders($headers)->putJson("/checklist-items/{$checklistItem->id}", $updatedData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['description', 'is_completed', 'checklist_id']);
    }
}
