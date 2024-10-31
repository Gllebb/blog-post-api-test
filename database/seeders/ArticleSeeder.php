<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Article;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $articles = [];
        $authors = User::all()->pluck('id')->toArray();

        for($i = 0; $i <= 100; $i++) {
            $articles[] = [
                'title' => $faker->sentence(),
                'text' => $faker->paragraph(),
                'author_id' => $faker->randomElement($authors),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Article::insert($articles);
    }
}
