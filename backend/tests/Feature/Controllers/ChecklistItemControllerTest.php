<?php

namespace Tests\Feature;

use App\Models\ChecklistItem;
use App\Models\Checklist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChecklistItemControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_checklist_items()
    {
        $user = User::factory()->create();
        ChecklistItem::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/checklist-items');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_checklist_item()
    {
        $user = User::factory()->create();
        $checklist = Checklist::factory()->create();

        $data = [
            'description' => 'New Item',
            'is_completed' => false,
            'checklist_id' => $checklist->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/checklist-items', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Checklist item created successfully.']);
    }

    public function test_can_update_checklist_item()
    {
        $user = User::factory()->create();
        $checklistItem = ChecklistItem::factory()->create(['description' => 'Old Item']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/checklist-items/{$checklistItem->id}", [
            'description' => 'Updated Item',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Checklist item updated successfully.']);
    }

    public function test_can_delete_checklist_item()
    {
        $user = User::factory()->create();
        $checklistItem = ChecklistItem::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/checklist-items/{$checklistItem->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Checklist item deleted successfully.']);
    }
}
