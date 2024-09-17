<?php

namespace Database\Factories;

use App\Models\CalendarEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CalendarEntryFactory extends Factory
{
    protected $model = CalendarEntry::class;

    public function definition()
    {
        $startTime = $this->faker->dateTimeBetween('now', '+1 month');
        $endTime = (clone $startTime)->modify('+1 hour');

        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->optional()->paragraph,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'user_id' => User::factory(),
        ];
    }
}
