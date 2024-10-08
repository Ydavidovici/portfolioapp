<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('invoice_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->string('payment_method');
            $table->string('stripe_payment_intent_id')->unique();
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
