<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistItemRequest extends FormRequest
{
    public function authorize()
    {
        // You can add role-based authorization logic here if necessary
        return true;
    }

    public function rules()
    {
        return [
            'description' => 'required|string',
            'is_completed' => 'boolean',
            'checklist_id' => 'required|exists:checklists,id',
        ];
    }
}
