<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id', 'title', 'slug', 'content', 'excerpt',
        'featured_image', 'tags', 'meta_tags', 'status', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'meta_tags' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
