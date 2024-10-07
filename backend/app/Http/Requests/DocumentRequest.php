<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
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
            'url' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
        ];
    }
}
