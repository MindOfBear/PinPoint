<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StripePaymentController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/dashboard', [PostController::class, 'index'])->name('dashboard');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->middleware('auth');
    Route::post('/posts/{post}/like', [PostController::class, 'likePost'])->middleware('auth');
});

Route::post('/orders', [OrderController::class, 'store']);

Route::post('/create-payment-intent', [StripePaymentController::class, 'createPaymentIntent']);
Route::post('/orders/{id}/accept', [OrderController::class, 'accept']);


require __DIR__.'/auth.php';
