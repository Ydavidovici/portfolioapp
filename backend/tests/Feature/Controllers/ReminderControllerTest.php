<?php

namespace Tests\Feature\Controllers;

use App\Models\Reminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReminderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_reminders()
    {
        Reminder::factory()->count(3)->create();

        $response = $this->getJson('/api/reminders');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_reminder()
    {
        $data = ['name' => 'New Reminder'];

        $response = $this->postJson('/api/reminders', $data);

        $response->assertStatus(201)
            ->assertJson(['name' => 'New Reminder']);
    }

    public function test_can_update_reminder()
    {
        $reminder = Reminder::factory()->create(['name' => 'Old Reminder']);

        $response = $this->putJson("/api/reminders/{$reminder->id}", [
            'name' => 'Updated Reminder',
        ]);

        $response->assertStatus(200)
            ->assertJson(['name' => 'Updated Reminder']);
    }

    public function test_can_delete_reminder()
    {
        $reminder = Reminder::factory()->create();

        $response = $this->deleteJson("/api/reminders/{$reminder->id}");

        $response->assertStatus(204);
    }
}
