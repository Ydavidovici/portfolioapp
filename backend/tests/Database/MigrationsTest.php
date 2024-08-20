<?php

namespace Tests\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class MigrationsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function users_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('users'));
        $this->assertTrue(Schema::hasColumns('users', [
            'id', 'username', 'email', 'password', 'role', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function projects_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('projects'));
        $this->assertTrue(Schema::hasColumns('projects', [
            'id', 'name', 'description', 'status', 'start_date', 'end_date', 'client_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function boards_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('boards'));
        $this->assertTrue(Schema::hasColumns('boards', [
            'id', 'name', 'description', 'project_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function lists_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('lists'));
        $this->assertTrue(Schema::hasColumns('lists', [
            'id', 'name', 'position', 'board_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function tasks_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('tasks'));
        $this->assertTrue(Schema::hasColumns('tasks', [
            'id', 'title', 'description', 'status', 'due_date', 'list_id', 'assigned_to', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function checklists_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('checklists'));
        $this->assertTrue(Schema::hasColumns('checklists', [
            'id', 'name', 'task_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function checklist_items_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('checklist_items'));
        $this->assertTrue(Schema::hasColumns('checklist_items', [
            'id', 'description', 'is_completed', 'checklist_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function documents_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('documents'));
        $this->assertTrue(Schema::hasColumns('documents', [
            'id', 'name', 'url', 'project_id', 'uploaded_by', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function messages_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('messages'));
        $this->assertTrue(Schema::hasColumns('messages', [
            'id', 'content', 'sender_id', 'receiver_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function invoices_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('invoices'));
        $this->assertTrue(Schema::hasColumns('invoices', [
            'id', 'amount', 'status', 'client_id', 'project_id', 'quickbooks_invoice_id', 'synced_with_quickbooks', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function payments_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('payments'));
        $this->assertTrue(Schema::hasColumns('payments', [
            'id', 'invoice_id', 'amount', 'payment_date', 'payment_method', 'quickbooks_payment_id', 'synced_with_quickbooks', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function quickbooks_tokens_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('quickbooks_tokens'));
        $this->assertTrue(Schema::hasColumns('quickbooks_tokens', [
            'id', 'user_id', 'access_token', 'refresh_token', 'token_expires_at', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function feedback_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('feedback'));
        $this->assertTrue(Schema::hasColumns('feedback', [
            'id', 'content', 'rating', 'project_id', 'submitted_by', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function notes_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('notes'));
        $this->assertTrue(Schema::hasColumns('notes', [
            'id', 'content', 'user_id', 'project_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function reminders_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('reminders'));
        $this->assertTrue(Schema::hasColumns('reminders', [
            'id', 'content', 'due_date', 'user_id', 'project_id', 'created_at', 'updated_at'
        ]));
    }

    /** @test */
    public function calendar_entries_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('calendar_entries'));
        $this->assertTrue(Schema::hasColumns('calendar_entries', [
            'id', 'title', 'description', 'start_time', 'end_time', 'user_id', 'project_id', 'task_id', 'reminder_id', 'note_id', 'created_at', 'updated_at'
        ]));
    }
}
