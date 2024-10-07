<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        // Base rules applicable to both create and update
        $rules = [
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,overdue',
            'quickbooks_invoice_id' => 'nullable|string',
            'synced_with_quickbooks' => 'boolean',
        ];

        // Additional rules for creating a new invoice
        if ($this->isMethod('post')) {
            $rules['client_id'] = 'required|exists:users,id';
            $rules['project_id'] = 'required|exists:projects,id';
        }

        // Optional rules for updating an existing invoice
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            // If you intend to allow updating client_id and project_id, uncomment the following lines:
            // $rules['client_id'] = 'sometimes|exists:users,id';
            // $rules['project_id'] = 'sometimes|exists:projects,id';
            // Otherwise, you can exclude them from update requests.
        }

        return $rules;
    }
}
