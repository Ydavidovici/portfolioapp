<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Checklist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChecklistControllerTest extends TestCase
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

    // Other test methods...

    /**
     * Test that a client cannot update a checklist.
     *
     * @return void
     */
    public function test_client_cannot_update_checklist()
    {
        // Retrieve the 'client' role
        $clientRole = Role::where('name', 'client')->first();

        // Create a client user and assign the 'client' role
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Create a checklist
        $checklist = Checklist::factory()->create([
            'title' => 'Client Checklist',
        ]);

        // Define updated data
        $updatedData = [
            'title' => 'Attempted Update',
        ];

        // Act as the client and make a PUT request to update the checklist
        $response = $this->actingAs($client)->putJson("/checklists/{$checklist->id}", $updatedData);

        // Assert that the update is forbidden
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        // Verify that the checklist was not updated in the database
        $this->assertDatabaseHas('checklists', [
            'id' => $checklist->id,
            'title' => 'Client Checklist',
        ]);
    }

    // Rest of the test methods...
}
