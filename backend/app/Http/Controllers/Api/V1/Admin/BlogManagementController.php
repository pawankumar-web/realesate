<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogManagementController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $posts = BlogPost::with('author')->latest()->paginate(20);

        return $this->paginated($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(4);
        $validated['author_id'] = auth()->id();

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blog', 'public');
        }
        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);

        return $this->success($post->load('author'), 'Blog post created', 201);
    }

    public function update(Request $request, BlogPost $blog): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array',
            'status' => 'sometimes|in:draft,published',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blog', 'public');
        }
        if (isset($validated['status']) && $validated['status'] === 'published' && ! $blog->published_at) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return $this->success($blog->load('author'), 'Blog post updated');
    }

    public function destroy(BlogPost $blog): JsonResponse
    {
        $blog->delete();

        return $this->success(null, 'Blog post deleted');
    }
}
