<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'url' => $this->faker->url,
            'project_id' => \App\Models\Project::factory(),
            'uploaded_by' => \App\Models\User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
