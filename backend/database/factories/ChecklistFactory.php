<?php

namespace Database\Factories;

use App\Models\Checklist;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChecklistFactory extends Factory
{
    protected $model = Checklist::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'task_id' => \App\Models\Task::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
