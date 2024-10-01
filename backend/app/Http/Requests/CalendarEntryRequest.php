<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalendarEntryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Authorization is handled in the controller via Gates
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
            'user_id' => 'required|exists:users,id',
        ];
    }

    /**
     * Customize the error messages for validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'start_time.date_format' => 'The start time field must match the format H:i:s.',
            'end_time.date_format' => 'The end time field must match the format H:i:s.',
            'end_time.after' => 'The end time must be after the start time.',
        ];
    }
}
