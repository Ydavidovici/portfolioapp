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
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('calendar_entries');
    }
}
