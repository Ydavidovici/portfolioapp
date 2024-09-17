<?php

namespace Database\Factories;

use App\Models\TaskList;
use App\Models\Board;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskListFactory extends Factory
{
    protected $model = TaskList::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'board_id' => Board::factory(),
        ];
    }
}
