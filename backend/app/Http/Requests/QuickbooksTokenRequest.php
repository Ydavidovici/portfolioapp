<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuickbooksTokenRequest extends FormRequest
{
    public function authorize()
    {
        // Authorization is handled in the controller
        return true;
    }

    public function rules()
    {
        return [
            'access_token' => 'required|string',
            'refresh_token' => 'required|string',
            'expires_in' => 'required|integer',
            'expires_at' => 'nullable|date',
        ];
    }
}
