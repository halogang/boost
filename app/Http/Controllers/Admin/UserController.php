<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {
        // Authorization is now handled via Policy in Request classes and controller methods
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $perPage = $request->input('per_page', 10);
        $filters = [
            'search' => $request->input('search', ''),
            'role' => $request->input('role', ''),
        ];

        $users = $this->userService->getPaginatedUsers($filters, $perPage);
        $roles = $this->userService->getRoles();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $filters['search'],
                'per_page' => (int) $perPage,
                'role' => $filters['role'],
            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        $roles = $this->userService->getRoles();

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $this->userService->createUser($request->validated());

            return redirect()->route('users.index')
                ->with('success', 'User berhasil dibuat');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user = $this->userService->getUser($user);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $user = $this->userService->getUser($user);
        $roles = $this->userService->getRoles();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $this->userService->updateUser($user, $request->validated());

            return redirect()->route('users.index')
                ->with('success', 'User berhasil diperbarui');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        try {
            $userName = $this->userService->deleteUser($user);

            return redirect()->route('users.index')
                ->with('success', "User '{$userName}' berhasil dihapus");
        } catch (\Exception $e) {
            return back()
                ->with('error', $e->getMessage());
        }
    }
}

