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
        $startTime = $this->faker->time('H:i:s');
        $endTime = date('H:i:s', strtotime($startTime) + 3600); // Adds 1 hour

        return [
            'title' => $this->faker->sentence,
            'date' => $this->faker->date(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'user_id' => User::factory(),
        ];
    }
}
