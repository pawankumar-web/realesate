<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CmsController extends Controller
{
    use ApiResponse;

    public function show(string $slug): JsonResponse
    {
        $page = CmsPage::where('slug', $slug)->firstOrFail();

        return $this->success($page);
    }
}
