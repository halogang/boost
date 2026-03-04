<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Permission;

class UpdateRolePermissionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Permission::class);
    }

    public function rules(): array
    {
        return [
            'permissions'   => 'array',
            'permissions.*' => 'exists:permissions,id',
        ];
    }
}
