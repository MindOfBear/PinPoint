<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Post;
use App\Models\Order;

class ProfileController extends Controller
{

    public function edit(Request $request): Response
    {
        $user = Auth::user();

        $posts = Post::where('user_id', $user->id)
            ->with(['user', 'likes'])
            ->get();

        $posts->each(function ($post) use ($user) {
            $post->likes_count = $post->likes->count();
            $post->liked_by_user = $post->likes->contains('user_id', $user->id);
        });

        $buyer_orders = Order::with(['post', 'seller'])->where('buyer_id', $user->id)->get();

        $seller_orders = Order::with(['post', 'buyer'])->where('seller_id', $user->id)->get();

        return Inertia::render('Profile/Edit', [
            'user' => $user,
            'posts' => $posts,
            'buyer_orders' => $buyer_orders,
            'seller_orders' => $seller_orders,
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
