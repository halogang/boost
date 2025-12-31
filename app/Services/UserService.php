<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    /**
     * Get paginated users with filters
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedUsers(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $search = trim($filters['search'] ?? '');
        $roleFilter = trim($filters['role'] ?? '');

        $query = User::with('roles')
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(!empty($roleFilter), function ($query) use ($roleFilter) {
                return $query->whereHas('roles', function ($q) use ($roleFilter) {
                    $q->where('name', $roleFilter);
                });
            })
            ->orderBy('created_at', 'desc');

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get all roles for filter dropdown
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRoles()
    {
        return Role::all(['id', 'name']);
    }

    /**
     * Get a single user with relationships
     *
     * @param User $user
     * @return User
     */
    public function getUser(User $user): User
    {
        $user->load('roles', 'permissions');
        return $user;
    }

    /**
     * Create a new user
     *
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function createUser(array $data): User
    {
        try {
            $roles = $data['roles'] ?? [];
            unset($data['roles']);

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user = User::create($data);

            if (!empty($roles)) {
                $user->syncRoles($roles);
            }

            return $user;
        } catch (\Exception $e) {
            throw new \Exception('Gagal membuat user: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing user
     *
     * @param User $user
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function updateUser(User $user, array $data): User
    {
        try {
            $roles = $data['roles'] ?? null;
            unset($data['roles']);

            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            if ($roles !== null) {
                $user->syncRoles($roles);
            }

            return $user->fresh();
        } catch (\Exception $e) {
            throw new \Exception('Gagal memperbarui user: ' . $e->getMessage());
        }
    }

    /**
     * Delete a user
     *
     * @param User $user
     * @return string User name for success message
     * @throws \Exception
     */
    public function deleteUser(User $user): string
    {
        try {
            // Business logic: Cannot delete the last admin user
            if ($user->hasRole('admin') && User::role('admin')->count() === 1) {
                throw new \Exception('Tidak dapat menghapus admin terakhir');
            }

            $userName = $user->name;
            $user->delete();
            return $userName;
        } catch (\Exception $e) {
            throw new \Exception('Gagal menghapus user: ' . $e->getMessage());
        }
    }
}

