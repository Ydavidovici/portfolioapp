<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReminderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'due_date' => 'required|date',
            'project_id' => 'nullable|exists:projects,id',
        ];
    }
}
