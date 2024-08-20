<?php

namespace Tests\Database;

use App\Models\User;
use App\Models\Project;
use App\Models\Board;
use App\Models\ListModel;
use App\Models\Task;
use App\Models\Checklist;
use App\Models\ChecklistItem;
use App\Models\Document;
use App\Models\Message;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\QuickBooksToken;
use App\Models\Feedback;
use App\Models\Note;
use App\Models\Reminder;
use App\Models\CalendarEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactoriesTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_factory_creates_user()
    {
        $user = User::factory()->create();
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    /** @test */
    public function project_factory_creates_project()
    {
        $project = Project::factory()->create();
        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    /** @test */
    public function board_factory_creates_board()
    {
        $board = Board::factory()->create();
        $this->assertDatabaseHas('boards', ['id' => $board->id]);
    }

    /** @test */
    public function list_factory_creates_list()
    {
        $list = ListModel::factory()->create();
        $this->assertDatabaseHas('lists', ['id' => $list->id]);
    }

    /** @test */
    public function task_factory_creates_task()
    {
        $task = Task::factory()->create();
        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function checklist_factory_creates_checklist()
    {
        $checklist = Checklist::factory()->create();
        $this->assertDatabaseHas('checklists', ['id' => $checklist->id]);
    }

    /** @test */
    public function checklist_item_factory_creates_checklist_item()
    {
        $checklistItem = ChecklistItem::factory()->create();
        $this->assertDatabaseHas('checklist_items', ['id' => $checklistItem->id]);
    }

    /** @test */
    public function document_factory_creates_document()
    {
        $document = Document::factory()->create();
        $this->assertDatabaseHas('documents', ['id' => $document->id]);
    }

    /** @test */
    public function message_factory_creates_message()
    {
        $message = Message::factory()->create();
        $this->assertDatabaseHas('messages', ['id' => $message->id]);
    }

    /** @test */
    public function invoice_factory_creates_invoice()
    {
        $invoice = Invoice::factory()->create();
        $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
    }

    /** @test */
    public function payment_factory_creates_payment()
    {
        $payment = Payment::factory()->create();
        $this->assertDatabaseHas('payments', ['id' => $payment->id]);
    }

    /** @test */
    public function quickbooks_token_factory_creates_quickbooks_token()
    {
        $token = QuickBooksToken::factory()->create();
        $this->assertDatabaseHas('quickbooks_tokens', ['id' => $token->id]);
    }

    /** @test */
    public function feedback_factory_creates_feedback()
    {
        $feedback = Feedback::factory()->create();
        $this->assertDatabaseHas('feedback', ['id' => $feedback->id]);
    }

    /** @test */
    public function note_factory_creates_note()
    {
        $note = Note::factory()->create();
        $this->assertDatabaseHas('notes', ['id' => $note->id]);
    }

    /** @test */
    public function reminder_factory_creates_reminder()
    {
        $reminder = Reminder::factory()->create();
        $this->assertDatabaseHas('reminders', ['id' => $reminder->id]);
    }

    /** @test */
    public function calendar_entry_factory_creates_calendar_entry()
    {
        $entry = CalendarEntry::factory()->create();
        $this->assertDatabaseHas('calendar_entries', ['id' => $entry->id]);
    }
}
