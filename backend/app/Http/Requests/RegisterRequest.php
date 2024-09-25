<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Allow registration if the user is a guest or has the 'admin' role
        return Auth::guest() || ($this->user() && $this->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        // Base validation rules applicable to all registrations
        $rules = [
            'username' => 'required|string|unique:users,username|max:255',
            'email' => 'required|string|email|unique:users,email|max:255',
            'password' => 'required|string|min:6|confirmed',
        ];

        // If the user is an admin, allow the 'role' field
        if ($this->user() && $this->user()->hasRole('admin')) {
            $rules['role'] = 'required|string|in:admin,developer,client';
        }

        return $rules;
    }

    /**
     * Customize the error messages.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'role.in' => 'The selected role is invalid.',
            'password.confirmed' => 'The password confirmation does not match.',
        ];
    }
}
