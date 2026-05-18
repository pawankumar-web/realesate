<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $users = User::with('vendor')->latest()->paginate(20);

        return $this->paginated($users);
    }

    public function show(User $user): JsonResponse
    {
        return $this->success($user->load('vendor', 'properties'));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $user->update($request->only(['name', 'email', 'phone', 'role', 'status']));

        return $this->success($user, 'User updated successfully');
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->success(null, 'User deleted successfully');
    }
}
