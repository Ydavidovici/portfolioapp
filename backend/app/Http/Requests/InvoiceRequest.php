<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Authorization can be adjusted based on roles.
    }

    public function rules()
    {
        return [
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,overdue',
            'client_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,id',
            'quickbooks_invoice_id' => 'nullable|string',
            'synced_with_quickbooks' => 'boolean',
        ];
    }
}
