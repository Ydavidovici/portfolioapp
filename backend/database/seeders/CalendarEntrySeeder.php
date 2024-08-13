<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalendarEntry;

class CalendarEntrySeeder extends Seeder
{
    public function run()
    {
        CalendarEntry::factory()->count(10)->create();
    }
}
