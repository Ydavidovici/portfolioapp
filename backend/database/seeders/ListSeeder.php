<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListModel;

class ListSeeder extends Seeder
{
    public function run()
    {
        ListModel::factory()->count(20)->create();
    }
}
