<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarEntriesTable extends Migration
{
    public function up()
    {
        Schema::create('calendar_entries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('project_id')->nullable()->constrained('projects');
            $table->foreignId('task_id')->nullable()->constrained('tasks');
            $table->foreignId('reminder_id')->nullable()->constrained('reminders');
            $table->foreignId('note_id')->nullable()->constrained('notes');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('calendar_entries');
    }
}
