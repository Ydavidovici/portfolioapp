<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_seeds_users()
    {
        $this->seed(\Database\Seeders\UserSeeder::class);
        $this->assertDatabaseCount('users', 10);
    }

    /** @test */
    public function it_seeds_projects()
    {
        $this->seed(\Database\Seeders\ProjectSeeder::class);
        $this->assertDatabaseCount('projects', 5);
    }

    /** @test */
    public function it_seeds_boards()
    {
        $this->seed(\Database\Seeders\BoardSeeder::class);
        $this->assertDatabaseCount('boards', 10);
    }

    /** @test */
    public function it_seeds_lists()
    {
        $this->seed(\Database\Seeders\ListSeeder::class);
        $this->assertDatabaseCount('lists', 20);
    }

    /** @test */
    public function it_seeds_tasks()
    {
        $this->seed(\Database\Seeders\TaskSeeder::class);
        $this->assertDatabaseCount('tasks', 50);
    }

    /** @test */
    public function it_seeds_checklists()
    {
        $this->seed(\Database\Seeders\ChecklistSeeder::class);
        $this->assertDatabaseCount('checklists', 30);
    }

    /** @test */
    public function it_seeds_checklist_items()
    {
        $this->seed(\Database\Seeders\ChecklistItemSeeder::class);
        $this->assertDatabaseCount('checklist_items', 100);
    }

    /** @test */
    public function it_seeds_documents()
    {
        $this->seed(\Database\Seeders\DocumentSeeder::class);
        $this->assertDatabaseCount('documents', 10);
    }

    /** @test */
    public function it_seeds_messages()
    {
        $this->seed(\Database\Seeders\MessageSeeder::class);
        $this->assertDatabaseCount('messages', 20);
    }

    /** @test */
    public function it_seeds_invoices()
    {
        $this->seed(\Database\Seeders\InvoiceSeeder::class);
        $this->assertDatabaseCount('invoices', 10);
    }

    /** @test */
    public function it_seeds_payments()
    {
        $this->seed(\Database\Seeders\PaymentSeeder::class);
        $this->assertDatabaseCount('payments', 10);
    }

    /** @test */
    public function it_seeds_quickbooks_tokens()
    {
        $this->seed(\Database\Seeders\QuickBooksTokenSeeder::class);
        $this->assertDatabaseCount('quickbooks_tokens', 5);
    }

    /** @test */
    public function it_seeds_feedback()
    {
        $this->seed(\Database\Seeders\FeedbackSeeder::class);
        $this->assertDatabaseCount('feedback', 15);
    }

    /** @test */
    public function it_seeds_notes()
    {
        $this->seed(\Database\Seeders\NoteSeeder::class);
        $this->assertDatabaseCount('notes', 25);
    }

    /** @test */
    public function it_seeds_reminders()
    {
        $this->seed(\Database\Seeders\ReminderSeeder::class);
        $this->assertDatabaseCount('reminders', 15);
    }

    /** @test */
    public function it_seeds_calendar_entries()
    {
        $this->seed(\Database\Seeders\CalendarEntrySeeder::class);
        $this->assertDatabaseCount('calendar_entries', 10);
    }
}
