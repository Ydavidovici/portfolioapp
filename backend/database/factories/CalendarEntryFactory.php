<?php

namespace Database\Factories;

use App\Models\CalendarEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

class CalendarEntryFactory extends Factory
{
    protected $model = CalendarEntry::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->optional()->paragraph,
            'start_time' => $this->faker->dateTime,
            'end_time' => $this->faker->dateTime,
            'user_id' => \App\Models\User::factory(),
            'project_id' => \App\Models\Project::factory(),
            'task_id' => \App\Models\Task::factory(),
            'reminder_id' => \App\Models\Reminder::factory(),
            'note_id' => \App\Models\Note::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
