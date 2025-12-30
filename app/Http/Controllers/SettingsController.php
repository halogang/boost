<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display system settings page
     */
    public function index()
    {
        $settings = [
            'primary_color' => Settings::get('primary_color', '#2563eb'), // Default blue
        ];

        return Inertia::render('Admin/System/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'primary_color' => 'required|string|regex:/^#[a-fA-F0-9]{6}$/',
        ]);

        Settings::set('primary_color', $validated['primary_color'], 'string', 'Primary color untuk aplikasi');

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui');
    }

    /**
     * Get all settings (API)
     */
    public function getAll()
    {
        return response()->json([
            'primary_color' => Settings::get('primary_color', '#2563eb'),
        ]);
    }
}
