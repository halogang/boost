<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Permission;

class TogglePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Permission::class);
    }

    public function rules(): array
    {
        return [
            'role_id'       => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
        ];
    }
}
