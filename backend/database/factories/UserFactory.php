<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'username' => $this->faker->userName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // default password
            'role' => $this->faker->randomElement(['admin', 'client', 'developer']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
