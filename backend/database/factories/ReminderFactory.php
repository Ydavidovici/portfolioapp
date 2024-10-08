<?php

namespace Database\Factories;

use App\Models\Reminder;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReminderFactory extends Factory
{
    protected $model = Reminder::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence(3),
            'content' => $this->faker->paragraph,
            'due_date' => $this->faker->date,
            'user_id' => \App\Models\User::factory(),
            'project_id' => \App\Models\Project::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
