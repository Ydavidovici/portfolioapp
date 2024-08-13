<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChecklistItem;

class ChecklistItemSeeder extends Seeder
{
    public function run()
    {
        ChecklistItem::factory()->count(100)->create();
    }
}
