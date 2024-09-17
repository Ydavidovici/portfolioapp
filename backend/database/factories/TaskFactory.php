<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TaskList;
use App\Models\User;
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
            'task_list_id' => TaskList::factory(),
            'assigned_to' => User::factory(),
        ];
    }
}
