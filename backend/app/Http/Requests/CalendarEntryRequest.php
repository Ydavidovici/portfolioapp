<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalendarEntryRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust this if you want to add authorization
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
