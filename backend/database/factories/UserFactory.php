<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     */
    public function definition()
    {
        // Generate a random raw token
        $rawToken = Str::random(60);

        return [
            'username' => $this->faker->unique()->userName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'), // Default password
            'api_token' => hash('sha256', $rawToken), // Hashed API token
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * State to set a specific raw API token.
     *
     * @param string $rawToken
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withRawToken(string $rawToken)
    {
        return $this->state(function (array $attributes) use ($rawToken) {
            return [
                'api_token' => hash('sha256', $rawToken),
            ];
        });
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
            ];
        });
    }

    /**
     * Indicate that the user is a developer.
     */
    public function developer()
    {
        return $this->state(function (array $attributes) {
            return [
            ];
        });
    }

    /**
     * Indicate that the user is a client.
     */
    public function client()
    {
        return $this->state(function (array $attributes) {
            return [
            ];
        });
    }
}
