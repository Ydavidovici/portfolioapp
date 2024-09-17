<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TaskList;

class TaskListSeeder extends Seeder
{
    public function run()
    {
        TaskList::factory()->count(20)->create();
    }
}
