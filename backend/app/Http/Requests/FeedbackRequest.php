<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FeedbackRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Authorization can be adjusted based on roles.
    }

    public function rules()
    {
        return [
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'project_id' => 'required|exists:projects,id',
            'submitted_by' => 'required|exists:users,id',
        ];
    }
}
