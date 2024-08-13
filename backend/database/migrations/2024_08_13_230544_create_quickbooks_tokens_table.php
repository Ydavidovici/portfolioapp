<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuickBooksTokensTable extends Migration
{
    public function up()
    {
        Schema::create('quickbooks_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->text('access_token');
            $table->text('refresh_token');
            $table->timestamp('token_expires_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quickbooks_tokens');
    }
}
