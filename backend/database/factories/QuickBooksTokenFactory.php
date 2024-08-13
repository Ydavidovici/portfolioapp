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
            'user_id' => \App\Models\User::factory(),
            'access_token' => $this->faker->sha256,
            'refresh_token' => $this->faker->sha256,
            'token_expires_at' => now()->addHours(2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
