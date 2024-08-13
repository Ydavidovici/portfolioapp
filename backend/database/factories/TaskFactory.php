<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->optional()->paragraph,
            'status' => $this->faker->randomElement(['to-do', 'in-progress', 'done']),
            'due_date' => $this->faker->optional()->date,
            'list_id' => \App\Models\ListModel::factory(),
            'assigned_to' => \App\Models\User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
