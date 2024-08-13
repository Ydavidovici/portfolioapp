<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Board;

class BoardSeeder extends Seeder
{
    public function run()
    {
        Board::factory()->count(10)->create();
    }
}
