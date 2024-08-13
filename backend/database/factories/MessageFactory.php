<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition()
    {
        return [
            'content' => $this->faker->text,
            'sender_id' => \App\Models\User::factory(),
            'receiver_id' => \App\Models\User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
