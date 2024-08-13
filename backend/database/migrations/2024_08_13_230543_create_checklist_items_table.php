<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecklistItemsTable extends Migration
{
    public function up()
    {
        Schema::create('checklist_items', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->boolean('is_completed')->default(false);
            $table->foreignId('checklist_id')->constrained('checklists');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('checklist_items');
    }
}
