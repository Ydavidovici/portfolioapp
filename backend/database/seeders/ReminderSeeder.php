<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reminder;

class ReminderSeeder extends Seeder
{
    public function run()
    {
        Reminder::factory()->count(15)->create();
    }
}
