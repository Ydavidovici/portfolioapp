<?php

namespace Database\Factories;

use App\Models\Note;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition()
    {
        return [
            'content' => $this->faker->paragraph,
            'user_id' => \App\Models\User::factory(),
            'project_id' => \App\Models\Project::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
