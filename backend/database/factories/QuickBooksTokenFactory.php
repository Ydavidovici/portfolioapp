<?php

namespace Database\Factories;

use App\Models\QuickBooksToken;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuickBooksTokenFactory extends Factory
{
    protected $model = QuickBooksToken::class;

    public function definition()
    {
        $expiresIn = $this->faker->numberBetween(1800, 7200);

        return [
            'access_token' => $this->faker->sha256,
            'refresh_token' => $this->faker->sha256,
            'expires_in' => $expiresIn,
            'expires_at' => now()->addHours(1),
        ];
    }
}
