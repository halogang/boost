<?php

namespace App\Http\Requests\Menu;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('menu'));
    }

    public function rules(): array
    {
        return [
            'name'                        => 'required|string|max:255',
            'icon'                        => 'nullable|string|max:255',
            'route'                       => 'nullable|string|max:255',
            'permission'                  => 'nullable|string|max:255',
            'parent_id'                   => 'nullable|exists:menus,id',
            'order'                       => 'nullable|integer|min:0',
            'active'                      => 'nullable|boolean',
            'positions'                   => 'nullable|array',
            'positions.desktop_sidebar'   => 'nullable|boolean',
            'positions.mobile_drawer'     => 'nullable|boolean',
            'positions.mobile_bottom'     => 'nullable|boolean',
            'roles'                       => 'nullable|array',
            'roles.*'                     => 'exists:roles,id',
        ];
    }
}
