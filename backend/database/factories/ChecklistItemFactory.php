<?php

namespace Database\Factories;

use App\Models\ChecklistItem;
use App\Models\Checklist;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChecklistItemFactory extends Factory
{
    protected $model = ChecklistItem::class;

    public function definition()
    {
        return [
            'description' => $this->faker->sentence,
            'is_completed' => $this->faker->boolean,
            'checklist_id' => Checklist::factory(),
        ];
    }
}
