<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRemindersTable extends Migration
{
    public function up()
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->date('due_date');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('project_id')->nullable()->constrained('projects');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reminders');
    }
}
