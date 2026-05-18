<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . auth()->id(),
            'phone' => 'sometimes|nullable|string|max:20|unique:users,phone,' . auth()->id(),
            'avatar' => 'sometimes|nullable|image|max:2048',
        ];
    }
}
