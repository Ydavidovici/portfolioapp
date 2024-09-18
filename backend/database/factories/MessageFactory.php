<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition()
    {
        return [
            'content' => $this->faker->sentence,
            'sender_id' => User::factory(),
            'receiver_id' => User::factory(),
            'file_path' => null,
            'file_name' => null,
        ];
    }
}
