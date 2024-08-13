<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuickBooksToken;

class QuickBooksTokenSeeder extends Seeder
{
    public function run()
    {
        QuickBooksToken::factory()->count(5)->create();
    }
}
