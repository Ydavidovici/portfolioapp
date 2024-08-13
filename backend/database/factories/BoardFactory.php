<?php

namespace Database\Factories;

use App\Models\Board;
use Illuminate\Database\Eloquent\Factories\Factory;

class BoardFactory extends Factory
{
    protected $model = Board::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->optional()->paragraph,
            'project_id' => \App\Models\Project::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
