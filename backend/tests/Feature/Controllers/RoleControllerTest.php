<?php

namespace Tests\Feature\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_role()
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::create(['name' => 'admin']));

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/roles', [
                'name' => 'newRole'
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('roles', ['name' => 'newRole']);
    }

    public function test_can_update_role()
    {
        $role = Role::create(['name' => 'oldRole']);
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::create(['name' => 'admin']));

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/roles/{$role->id}", ['name' => 'updatedRole']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('roles', ['name' => 'updatedRole']);
    }

    public function test_can_delete_role()
    {
        $role = Role::create(['name' => 'testRole']);
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::create(['name' => 'admin']));

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/roles/{$role->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('roles', ['name' => 'testRole']);
    }
}
