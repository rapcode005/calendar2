<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controller\CalendarController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('v1')->group(function () {
    Route::get('/calendar', App\Http\Controllers\CalendarController::class.'@show');
    Route::post('/calendar', App\Http\Controllers\CalendarController::class.'@store');
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
