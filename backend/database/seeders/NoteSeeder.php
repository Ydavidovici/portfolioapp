<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;

class NoteSeeder extends Seeder
{
    public function run()
    {
        Note::factory()->count(25)->create();
    }
}
