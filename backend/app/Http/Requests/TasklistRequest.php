<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TasklistRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'board_id' => 'required|exists:boards,id',
        ];
    }
}
