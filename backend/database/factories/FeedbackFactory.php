<?php

namespace Database\Factories;

use App\Models\Feedback;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition()
    {
        return [
            'content' => $this->faker->paragraph,
            'rating' => $this->faker->numberBetween(1, 5),
            'project_id' => \App\Models\Project::factory(),
            'submitted_by' => \App\Models\User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
