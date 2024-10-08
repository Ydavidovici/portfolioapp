<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'invoice_id' => Invoice::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'payment_date' => $this->faker->date(),
            'payment_method' => $this->faker->randomElement(['pm_card_visa', 'pm_card_mastercard', 'pm_card_amex', 'pm_card_discover']),
            'stripe_payment_intent_id' => 'pi_' . Str::random(24),
            'status' => 'succeeded',
        ];
    }
}
