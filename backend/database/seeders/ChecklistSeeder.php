<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Checklist;

class ChecklistSeeder extends Seeder
{
    public function run()
    {
        Checklist::factory()->count(30)->create();
    }
}
