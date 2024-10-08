<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // Common rules for both create and update
        $rules = [
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|max:255',
        ];

        // Additional rules for create (POST) requests
        if ($this->isMethod('post')) {
            $rules['invoice_id'] = 'required|exists:invoices,id';
        }

        // Additional rules for update (PUT/PATCH) requests
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['invoice_id'] = 'sometimes|exists:invoices,id';
        }

        return $rules;
    }
}
