<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleReputation extends Model
{
    protected $fillable = [
        'article_id', 
        'user_id', 
        'is_upvote',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
