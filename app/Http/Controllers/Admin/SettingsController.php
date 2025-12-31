<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSettingsRequest;
use App\Models\Settings;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function __construct(
        protected SettingsService $settingsService
    ) {
        // Authorization is now handled via Policy in Request classes and controller methods
    }

    /**
     * Display system settings page
     */
    public function index()
    {
        $this->authorize('viewAny', Settings::class);

        $settings = $this->settingsService->getAllSettings();

        return Inertia::render('Admin/System/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings
     */
    public function update(UpdateSettingsRequest $request)
    {
        try {
            $this->settingsService->updateSettings($request->validated());

            return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Get all settings (API)
     */
    public function getAll()
    {
        $settings = $this->settingsService->getAllSettings();

        return response()->json($settings);
    }
}

