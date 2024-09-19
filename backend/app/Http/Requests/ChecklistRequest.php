<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistRequest extends FormRequest
{
    public function authorize()
    {
        // You can add role-based authorization logic here if necessary
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
