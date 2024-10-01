<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistRequest extends FormRequest
{
    public function authorize()
    {
        // Authorization is handled in the controller via Gates
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'task_id' => 'required|exists:tasks,id',
        ];
    }
}
