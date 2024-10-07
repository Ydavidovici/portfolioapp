<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Checklist;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ChecklistControllerTest extends TestCase
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
     * Test that an admin can create a checklist.
     */
    public function test_admin_can_create_checklist()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $task = Task::factory()->create();

        $checklistData = [
            'name' => 'Admin Checklist',
            'task_id' => $task->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->postJson('/checklists', $checklistData);

        // Assert
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Checklist created successfully.',
                'checklist' => [
                    'name' => 'Admin Checklist',
                    'task_id' => $task->id,
                ],
            ]);

        $this->assertDatabaseHas('checklists', [
            'name' => 'Admin Checklist',
            'task_id' => $task->id,
        ]);
    }

    /**
     * Test that a client cannot create a checklist.
     */
    public function test_client_cannot_create_checklist()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        $task = Task::factory()->create();

        $checklistData = [
            'name' => 'Client Checklist',
            'task_id' => $task->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->postJson('/checklists', $checklistData);

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        $this->assertDatabaseMissing('checklists', [
            'name' => 'Client Checklist',
            'task_id' => $task->id,
        ]);
    }

    /**
     * Test that an admin can update a checklist.
     */
    public function test_admin_can_update_checklist()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $task = Task::factory()->create();

        $checklist = Checklist::factory()->create([
            'name' => 'Original Checklist',
            'task_id' => $task->id,
        ]);

        $updatedData = [
            'name' => 'Updated Checklist',
            'task_id' => $task->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->putJson("/checklists/{$checklist->id}", $updatedData);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist updated successfully.',
                'checklist' => [
                    'id' => $checklist->id,
                    'name' => 'Updated Checklist',
                    'task_id' => $task->id,
                ],
            ]);

        $this->assertDatabaseHas('checklists', [
            'id' => $checklist->id,
            'name' => 'Updated Checklist',
            'task_id' => $task->id,
        ]);
    }

    /**
     * Test that a client cannot update a checklist.
     */
    public function test_client_cannot_update_checklist()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        $task = Task::factory()->create();

        $checklist = Checklist::factory()->create([
            'name' => 'Client Checklist',
            'task_id' => $task->id,
        ]);

        $updatedData = [
            'name' => 'Attempted Update',
            'task_id' => $task->id,
        ];

        // Act
        $response = $this->withHeaders($headers)->putJson("/checklists/{$checklist->id}", $updatedData);

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        $this->assertDatabaseHas('checklists', [
            'id' => $checklist->id,
            'name' => 'Client Checklist',
            'task_id' => $task->id,
        ]);
    }

    /**
     * Test that an admin can delete a checklist.
     */
    public function test_admin_can_delete_checklist()
    {
        // Arrange
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        // Authenticate the admin and get headers
        $headers = $this->authenticate($admin);

        $task = Task::factory()->create();

        $checklist = Checklist::factory()->create([
            'name' => 'Checklist to Delete',
            'task_id' => $task->id,
        ]);

        // Act
        $response = $this->withHeaders($headers)->deleteJson("/checklists/{$checklist->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Checklist deleted successfully.',
            ]);

        $this->assertDatabaseMissing('checklists', [
            'id' => $checklist->id,
        ]);
    }

    /**
     * Test that a client cannot delete a checklist.
     */
    public function test_client_cannot_delete_checklist()
    {
        // Arrange
        $clientRole = Role::where('name', 'client')->first();
        $client = User::factory()->create();
        $client->roles()->attach($clientRole);

        // Authenticate the client and get headers
        $headers = $this->authenticate($client);

        $task = Task::factory()->create();

        $checklist = Checklist::factory()->create([
            'name' => 'Client Checklist to Delete',
            'task_id' => $task->id,
        ]);

        // Act
        $response = $this->withHeaders($headers)->deleteJson("/checklists/{$checklist->id}");

        // Assert
        $response->assertStatus(403)
            ->assertJson([
                'message' => 'This action is unauthorized.',
            ]);

        $this->assertDatabaseHas('checklists', [
            'id' => $checklist->id,
            'name' => 'Client Checklist to Delete',
            'task_id' => $task->id,
        ]);
    }

    /**
     * Test that any authenticated user can view checklists.
     */
    public function test_any_authenticated_user_can_view_checklists()
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

        $checklists = Checklist::factory()->count(3)->create();

        // Act & Assert
        $users->each(function ($user) use ($checklists) {
            $response = $this->withHeaders($user->headers)->getJson('/checklists');

            $response->assertStatus(200)
                ->assertJsonCount(3);

            $checklists->each(function ($checklist) use ($response) {
                $response->assertJsonFragment([
                    'id' => $checklist->id,
                    'name' => $checklist->name,
                    'task_id' => $checklist->task_id,
                ]);
            });
        });
    }

    /**
     * Test that an unauthenticated user cannot view checklists.
     */
    public function test_unauthenticated_user_cannot_view_checklists()
    {
        // Arrange
        Checklist::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/checklists');

        // Assert
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
