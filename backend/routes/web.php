<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is for defining web routes. Laravel will serve the React
| app's index.html for any route not matched by the API or other routes.
|
*/

/* Optional: Keep this if you want to serve a Laravel view at the root
Route::get('/', function () {
    return view('welcome');
});*/

// Catch-all route to serve React app
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');

Route::get('/db-test', function () {
    return DB::select('SELECT NOW()');
});
