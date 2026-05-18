<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogPostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(5);

        return [
            'author_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(4),
            'content' => fake()->paragraphs(5, true),
            'excerpt' => fake()->sentence(),
            'featured_image' => null,
            'tags' => fake()->words(3),
            'status' => 'published',
            'published_at' => now(),
        ];
    }
}
