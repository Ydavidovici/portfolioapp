<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'overdue']);
            $table->foreignId('client_id')->constrained('users');
            $table->foreignId('project_id')->constrained('projects');
            $table->string('quickbooks_invoice_id')->nullable();
            $table->boolean('synced_with_quickbooks')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
