<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuickbooksTokenRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'access_token' => 'required|string|max:255',
            'refresh_token' => 'required|string|max:255',
            'expires_at' => 'required|date',
        ];
    }
}
