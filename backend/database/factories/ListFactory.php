<?php

namespace Database\Factories;

use App\Models\ListModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListFactory extends Factory
{
    protected $model = ListModel::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'position' => $this->faker->numberBetween(1, 10),
            'board_id' => \App\Models\Board::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
