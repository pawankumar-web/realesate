<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AgentController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $agents = User::where('role', 'vendor')
            ->whereHas('vendor', fn ($q) => $q->where('is_verified', true))
            ->with('vendor')
            ->paginate(12);

        return $this->paginated($agents);
    }

    public function show(int $id): JsonResponse
    {
        $agent = User::where('role', 'vendor')
            ->with('vendor', 'properties.images')
            ->findOrFail($id);

        return $this->success(new UserResource($agent));
    }
}
