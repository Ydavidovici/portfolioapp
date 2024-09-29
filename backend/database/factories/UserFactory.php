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
        // Generate a raw token
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
     * Indicate that the user is an admin.
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                // Additional attributes specific to admin can be added here
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
                // Additional attributes specific to developer can be added here
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
                // Additional attributes specific to client can be added here
            ];
        });
    }
}
