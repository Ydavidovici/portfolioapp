<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\ChecklistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChecklistItemControllerTest extends TestCase
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
     * Test that an admin can create a checklist item.
     *
     * @return void
     */
    public function test_admin_can_create_checklist_item()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Define checklist item data
        $checklistItemData = [
            'title' => 'New Checklist Item',
            // Add other necessary fields as per your ChecklistItem model
        ];

        // Act as the admin and make a POST request to create a checklist item
        $response = $this->actingAs($admin)->postJson('/checklist-items', $checklistItemData);

        // Assert that the checklist item was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Checklist item created successfully.',
                'checklist_item' => [
                    'title' => 'New Checklist Item',
                ],
            ]);

        // Verify that the checklist item exists in the database
        $this->assertDatabaseHas('checklist_items', [
            'title' => 'New Checklist Item',
        ]);
    }

    /**
     * Test that a developer can create a checklist item.
     *
     * @return void
     */
    public function test_developer_can_create_checklist_item()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Define checklist item data
        $checklistItemData = [
            'title' => 'Developer Checklist Item',
            // Add other necessary fields as per your ChecklistItem model
        ];

        // Act as the developer and make a POST request to create a checklist item
        $response = $this->actingAs($developer)->postJson('/checklist-items', $checklistItemData);

        // Assert that the checklist item was created successfully
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Checklist item created successfully.',
                'checklist_item' => [
                    'title' => 'Developer Checklist Item',
                ],
            ]);

        // Verify that the checklist item exists in the database
        $this->assertDatabaseHas('checklist_items', [
            'title' => 'Developer Checklist Item',
        ]);
    }

    /**
     * Test that a client cannot create a checklist item.
     *
     * @return void
     */
    public function test_client_cannot_create_checklist_item()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Define checklist item data
        $checklistItemData = [
            'title' => 'Unauthorized Checklist Item',
            // Add other necessary fields as per your ChecklistItem model
        ];

        // Act as the client and make a POST request to create a checklist item
        $response = $this->actingAs($client)->postJson('/checklist-items', $checklistItemData);

        // Assert that the creation is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the checklist item does not exist in the database
        $this->assertDatabaseMissing('checklist_items', [
            'title' => 'Unauthorized Checklist Item',
        ]);
    }

    /**
     * Test that an admin can update a checklist item.
     *
     * @return void
     */
    public function test_admin_can_update_checklist_item()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a checklist item
        $checklistItem = ChecklistItem::factory()->create([
            'title' => 'Original Checklist Item',
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Updated Checklist Item',
        ];

        // Act as the admin and make a PUT request to update the checklist item
        $response = $this->actingAs($admin)->putJson("/checklist-items/{$checklistItem->id}", $updatedData);

        // Assert that the checklist item was updated successfully
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item updated successfully.',
                'checklist_item' => [
                    'id' => $checklistItem->id,
                    'title' => 'Updated Checklist Item',
                ],
            ]);

        // Verify that the checklist item was updated in the database
        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
            'title' => 'Updated Checklist Item',
        ]);
    }

    /**
     * Test that a client cannot update a checklist item.
     *
     * @return void
     */
    public function test_client_cannot_update_checklist_item()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a checklist item
        $checklistItem = ChecklistItem::factory()->create([
            'title' => 'Client Checklist Item',
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update',
        ];

        // Act as the client and make a PUT request to update the checklist item
        $response = $this->actingAs($client)->putJson("/checklist-items/{$checklistItem->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the checklist item was not updated in the database
        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
            'title' => 'Client Checklist Item',
        ]);
    }

    /**
     * Test that an admin can delete a checklist item.
     *
     * @return void
     */
    public function test_admin_can_delete_checklist_item()
    {
        // Retrieve the 'admin' role
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Create a checklist item
        $checklistItem = ChecklistItem::factory()->create([
            'title' => 'Checklist Item to Delete',
        ]);

        // Act as the admin and make a DELETE request to delete the checklist item
        $response = $this->actingAs($admin)->deleteJson("/checklist-items/{$checklistItem->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item deleted successfully.',
            ]);

        // Verify that the checklist item no longer exists in the database
        $this->assertDatabaseMissing('checklist_items', [
            'id' => $checklistItem->id,
        ]);
    }

    /**
     * Test that a developer can delete a checklist item.
     *
     * @return void
     */
    public function test_developer_can_delete_checklist_item()
    {
        // Retrieve the 'developer' role
        $developerRole = Role::where('name', 'developer')->first();

        // Create a developer user and assign the 'developer' role
        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        // Create a checklist item
        $checklistItem = ChecklistItem::factory()->create([
            'title' => 'Developer Checklist Item to Delete',
        ]);

        // Act as the developer and make a DELETE request to delete the checklist item
        $response = $this->actingAs($developer)->deleteJson("/checklist-items/{$checklistItem->id}");

        // Assert that the deletion was successful
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist item deleted successfully.',
            ]);

        // Verify that the checklist item no longer exists in the database
        $this->assertDatabaseMissing('checklist_items', [
            'id' => $checklistItem->id,
        ]);
    }

    /**
     * Test that a client cannot delete a checklist item.
     *
     * @return void
     */
    public function test_client_cannot_delete_checklist_item()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a checklist item
        $checklistItem = ChecklistItem::factory()->create([
            'title' => 'Client Checklist Item to Delete',
        ]);

        // Act as the client and make a DELETE request to delete the checklist item
        $response = $this->actingAs($client)->deleteJson("/checklist-items/{$checklistItem->id}");

        // Assert that the deletion is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the checklist item still exists in the database
        $this->assertDatabaseHas('checklist_items', [
            'id' => $checklistItem->id,
            'title' => 'Client Checklist Item to Delete',
        ]);
    }

    /**
     * Test that any authenticated user can view checklist items.
     *
     * @return void
     */
    public function test_any_authenticated_user_can_view_checklist_items()
    {
        // Retrieve roles
        $adminRole = Role::where('name', 'admin')->first();
        $developerRole = Role::where('name', 'developer')->first();
        $clientRole = Role::where('name', 'client')->first();

        // Create users
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $developer = User::factory()->create();
        $developer->roles()->attach($developerRole);

        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create checklist items
        $checklistItems = ChecklistItem::factory()->count(3)->create();

        // Test for each user
        foreach ([$admin, $developer, $client] as $user) {
            $response = $this->actingAs($user)->getJson('/checklist-items');

            $response->assertStatus(200)
                ->assertJsonCount(3);

            foreach ($checklistItems as $item) {
                $response->assertJsonFragment([
                    'id' => $item->id,
                    'title' => $item->title,
                ]);
            }
        }
    }

    /**
     * Test that an unauthenticated user cannot view checklist items.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_view_checklist_items()
    {
        // Create checklist items
        $checklistItems = ChecklistItem::factory()->count(3)->create();

        // Make a GET request without authentication
        $response = $this->getJson('/checklist-items');

        // Assert that the response is unauthorized
        $response->assertStatus(401);
    }
}
