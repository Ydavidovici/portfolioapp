<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistItemRequest extends FormRequest
{
    public function authorize()
    {
        // Authorization is handled in the controller via Gates
        return true;
    }

    public function rules()
    {
        return [
            'description' => 'required|string|max:255',
            'is_completed' => 'sometimes|boolean',
            'checklist_id' => 'required|exists:checklists,id',
        ];
    }
}
