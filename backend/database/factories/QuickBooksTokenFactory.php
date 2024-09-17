<?php

namespace Database\Factories;

use App\Models\QuickBooksToken;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuickBooksTokenFactory extends Factory
{
    protected $model = QuickBooksToken::class;

    public function definition()
    {
        return [
            'access_token' => $this->faker->sha256,
            'refresh_token' => $this->faker->sha256,
            'expires_at' => now()->addHours(1),
        ];
    }
}
