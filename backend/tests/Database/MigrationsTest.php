<?php

namespace Tests\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MigrationsTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function users_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('users'), 'Users table does not exist');

        $expectedColumns = [
            'id',
            'username', // Updated to reflect your migration
            'email',
            'password',
            'role',
            'created_at',
            'updated_at',
        ];

        foreach ($expectedColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('users', $column),
                "Column {$column} does not exist in users table"
            );
        }

        foreach ($expectedColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('users', $column),
                "Column {$column} does not exist in users table"
            );
        }
    }

    #[Test]
    public function projects_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('projects'), 'Projects table does not exist');

        $expectedColumns = [
            'id',
            'name',
            'description',
            'status',
            'start_date',
            'end_date',
            'client_id',
            'created_at',
            'updated_at',
        ];

        foreach ($expectedColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('projects', $column),
                "Column {$column} does not exist in projects table"
            );
        }
    }


    #[Test]
    public function tasks_table_has_expected_columns()
    {
        $this->assertTrue(Schema::hasTable('tasks'), 'Tasks table does not exist');

        $expectedColumns = [
            'id',
            'title',
            'description',
            'status',
            'due_date',
            'task_list_id',
            'assigned_to',
            'created_at',
            'updated_at',
        ];

        foreach ($expectedColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('tasks', $column),
                "Column {$column} does not exist in tasks table"
            );
        }
    }
}
