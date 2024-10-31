<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\api\UserController;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'user']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::put('/user/{id}', [UserController::class, 'update']);
});

Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'index']);
    Route::get('/search/{title}', [ArticleController::class, 'search']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [ArticleController::class, 'store']);

        Route::delete('/{id}', [ArticleController::class, 'destroy']);

        Route::put('/{id}', [ArticleController::class, 'update']);

        Route::post('/vote/{id}', [ArticleController::class, 'vote']);
    });
});
