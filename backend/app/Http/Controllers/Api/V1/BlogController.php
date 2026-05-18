<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class BlogController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $posts = BlogPost::where('status', 'published')
            ->with('author')
            ->latest('published_at')
            ->paginate(10);

        return $this->paginated($posts);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)
            ->where('status', 'published')
            ->with('author')
            ->firstOrFail();

        return $this->success($post);
    }
}
