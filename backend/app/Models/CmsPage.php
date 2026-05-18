<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsPage extends Model
{
    protected $fillable = ['title', 'slug', 'content', 'meta_tags'];

    protected function casts(): array
    {
        return ['meta_tags' => 'array'];
    }
}
