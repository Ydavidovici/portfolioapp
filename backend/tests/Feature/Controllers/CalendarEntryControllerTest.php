<?php

namespace Tests\Feature;

use App\Models\CalendarEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarEntryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_calendar_entries()
    {
        $user = User::factory()->create();
        CalendarEntry::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/calendar-entries');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_calendar_entry()
    {
        $user = User::factory()->create();

        $data = [
            'title' => 'Meeting',
            'description' => 'Team meeting',
            'start_time' => now(),
            'end_time' => now()->addHour(),
            'user_id' => $user->id,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/calendar-entries', $data);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Calendar entry created successfully.']);
    }

    public function test_can_update_calendar_entry()
    {
        $user = User::factory()->create();
        $calendarEntry = CalendarEntry::factory()->create(['title' => 'Old Title']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/calendar-entries/{$calendarEntry->id}", [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Calendar entry updated successfully.']);
    }

    public function test_can_delete_calendar_entry()
    {
        $user = User::factory()->create();
        $calendarEntry = CalendarEntry::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/calendar-entries/{$calendarEntry->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Calendar entry deleted successfully.']);
    }
}
