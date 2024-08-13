<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecklistsTable extends Migration
{
    public function up()
    {
        Schema::create('checklists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('task_id')->constrained('tasks');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('checklists');
    }
}
