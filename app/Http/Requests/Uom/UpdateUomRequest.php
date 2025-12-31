<?php

namespace App\Http\Requests\Uom;

use App\Models\Uom;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('uom'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'ratio' => 'required|numeric|min:0',
            'uom_type' => 'required|in:reference,bigger,smaller',
            'rounding' => 'nullable|numeric|min:0',
            'active' => 'boolean',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ];
    }
}

