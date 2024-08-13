<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        return [
            'invoice_id' => \App\Models\Invoice::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'payment_date' => $this->faker->dateTime,
            'payment_method' => $this->faker->creditCardType,
            'quickbooks_payment_id' => $this->faker->uuid,
            'synced_with_quickbooks' => $this->faker->boolean,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
