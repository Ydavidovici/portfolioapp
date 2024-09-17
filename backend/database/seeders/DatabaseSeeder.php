<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            ProjectSeeder::class,
            BoardSeeder::class,
            TaskListSeeder::class,
            TaskSeeder::class,
            ChecklistSeeder::class,
            ChecklistItemSeeder::class,
            DocumentSeeder::class,
            MessageSeeder::class,
            InvoiceSeeder::class,
            PaymentSeeder::class,
            QuickBooksTokenSeeder::class,
            FeedbackSeeder::class,
            NoteSeeder::class,
            ReminderSeeder::class,
            CalendarEntrySeeder::class,
        ]);
    }
}
