<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\ArticleReputation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    public function index(Request $request) {
        try {
            $page = $request->input('page', 1);
            $articles = Article::paginate(10, ['*'], 'page', $page);

            if ($articles->isEmpty()) {
                return response()->json([
                    'data' => [],
                ], 404);
            }

            $articlesData = [];
            foreach ($articles as $article) {
                $reputationCount = ArticleReputation::where('article_id', $article->id)->count();
                $article['reputation'] = $reputationCount;

                $user = $article->user;

                $articlesData[] = [
                    'id' => $article->id,
                    'title' => $article->title,
                    'text' => $article->text,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                    'reputation' => $reputationCount,
                ];
            }

            return response()->json([
                'data' => $articlesData,
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'from' => $articles->firstItem(),
                    'last_page' => $articles->lastPage(),
                    'per_page' => $articles->perPage(),
                    'links' => [
                        'first' => $articles->url(1),
                        'last' => $articles->url($articles->lastPage()),
                        'prev' => $articles->previousPageUrl(),
                        'next' => $articles->nextPageUrl(),
                    ],
                    'meta' => [
                        'links' => $articles->linkCollection()->toArray(),
                    ],
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                throw new AuthenticationException();
            }

            $validatedData = $request->validate([
                'title' => 'required',
                'text' => 'required|min:8',
            ]);

            $article = Article::create([
                'title' => $validatedData['title'],
                'text' => $validatedData['text'],
                'author_id' => Auth::id(),
            ]);

            $reputaionCount = ArticleReputation::where('article_id', $article->id)->count();

            return response()->json([
                'data' => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'text' => $article->text,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                    'reputaion' => $reputaionCount,
                ]
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                throw new AuthenticationException();
            }
            
            $article = Article::find($id);

            if ($article) {
                $articleData = [
                    'id' => $article->id,
                    'title' => $article->title,
                    'text' => $article->text,
                ];

                $reputaionCount = ArticleReputation::where('article_id', $articleData['id'])->count();

                $article->delete();

                return response()->json([
                    'data' => [
                        'id' => $articleData['id'],
                        'title' => $article['title'],
                        'text' => $article['text'],
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'created_at' => $user->created_at,
                            'updated_at' => $user->updated_at,
                        ],
                        'reputaion' => $reputaionCount,
                    ]
                ]);
            }
        } catch (ValidationException $e) {
            return [
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ];
        } catch (Exception $e) {
            return [
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ];
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                throw new AuthenticationException();
            }

            $article = Article::find($id);

            if ($article) {
                $validatedData = $request->validate([
                    'title' => 'required',
                    'text' => 'required|min:8',
                ]);

                $article->title = $validatedData['title'];
                $article->text = $validatedData['text'];
                $article->save();

                $articleData = [
                    'id' => $article->id,
                    'title' => $article->title,
                    'text' => $article->text,
                ];

                $reputationCount = ArticleReputation::where('article_id', $articleData['id'])->count();

                return response()->json([
                    'data' => [
                        'id' => $articleData['id'],
                        'title' => $articleData['title'],
                        'text' => $articleData['text'],
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'created_at' => $user->created_at,
                            'updated_at' => $user->updated_at,
                        ],
                        'reputaion' => $reputationCount,
                    ]
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function search($title) {
        try {
            $articles = Article::where('title', 'like', "%$title%")->get();

            if ($articles->isEmpty()) {
                return response()->json([
                    'data' => [],
                ], 404);
            }

            foreach ($articles as $article) {
                $reputationCount = ArticleReputation::where('article_id', $article->id)->count();
                $article['reputation'] = $reputationCount;

                $user = $article->user;

                $articlesData[] = [
                    'id' => $article->id,
                    'title' => $article->title,
                    'text' => $article->text,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                    'reputation' => $reputationCount,
                ];
            }

            return response()->json([
                'data' => $articlesData,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function vote(Request $request, $id) {
        try {
            $user = Auth::user();
            if (!$user) {
                throw new AuthenticationException();
            }

            $article = Article::find($id);
            if (!$article) {
                return response()->json([
                    'message' => 'Article not found',
                ], 404);
            }

            $is_upvote = $request->is_upvote;

            if ($is_upvote === null) {
                return response()->json([
                    'message' => 'is upvote field is required',
                ], 422);
            }

            $reputation = ArticleReputation::where('article_id', $article->id)
                ->where('user_id', $user->id)
                ->first();


            if ($reputation) {
                if ($is_upvote == $reputation->is_upvote) {
                    $reputation->delete();

                    return response()->json([
                        'message' => 'Article vote has been removed',
                    ]);

                } else {
                    $reputation->is_upvote = $is_upvote;
                    $reputation->save();

                    if ($is_upvote) {
                        return response()->json([
                            'message' => 'Article has been upvoted',
                        ]);
                    } else {
                        return response()->json([
                            'message' => 'Article has been downvoted',
                        ]);
                    }
                }
            }

            if ($is_upvote) {
                $reputation = ArticleReputation::create([
                    'article_id' => $article->id,
                    'user_id' => $user->id,
                    'is_upvote' => true,
                ]);

                return response()->json([
                    'message' => 'Article has been upvoted',
                ]);
            } else {
                $reputation = ArticleReputation::create([
                    'article_id' => $article->id,
                    'user_id' => $user->id,
                    'is_upvote' => false,
                ]);

                return response()->json([
                    'message' => 'Article has been downvoted',
                ]);
            }

        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
