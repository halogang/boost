<?php

namespace App\Http\Requests\ProductProduct;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\ProductProduct::class);
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
            'default_code' => 'nullable|string|max:255|unique:product_product,default_code',
            'barcode' => 'nullable|string|max:255|unique:product_product,barcode',
            'description' => 'nullable|string',
            'description_purchase' => 'nullable|string',
            'description_sale' => 'nullable|string',
            'type' => 'required|in:consu,service,product',
            'purchase_method' => 'required|in:purchase,make_to_order,receive',
            'purchase_ok' => 'boolean',
            'sale_ok' => 'boolean',
            'active' => 'boolean',
            'uom_id' => 'nullable|exists:uoms,id',
            'uom_po_id' => 'nullable|exists:uoms,id',
            'list_price' => 'nullable|numeric|min:0',
            'standard_price' => 'nullable|numeric|min:0',
            'categ_name' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ];
    }
}

