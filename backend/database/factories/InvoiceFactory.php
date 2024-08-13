<?php

namespace Database\Factories;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition()
    {
        return [
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'status' => $this->faker->randomElement(['pending', 'paid', 'overdue']),
            'client_id' => \App\Models\User::factory(),
            'project_id' => \App\Models\Project::factory(),
            'quickbooks_invoice_id' => $this->faker->uuid,
            'synced_with_quickbooks' => $this->faker->boolean,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
