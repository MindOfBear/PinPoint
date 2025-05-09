<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Like;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $latitude = $request->query('latitude');
        $longitude = $request->query('longitude');
        $price = $request->input('price');

        if (!$latitude || !$longitude) {
            return Inertia::render('Dashboard', [
                'posts' => [],
            ]);
        }

        // $radius = 4000;

        // $posts = Post::with('user', 'likes')
        //     ->selectRaw("
        //         *, 
        //         (6371000 * acos(
        //             cos(radians(?)) * cos(radians(latitude)) * 
        //             cos(radians(longitude) - radians(?)) + 
        //             sin(radians(?)) * sin(radians(latitude))
        //         )) AS distance", 
        //         [$latitude, $longitude, $latitude]
        //     )
        //     ->having('distance', '<=', $radius)
        //     ->orderBy('created_at', 'desc')
        //     ->get();

        $posts = Post::with('user', 'likes')
        ->orderBy('created_at', 'desc')
        ->get();
        
            $posts->map(function ($post) {
                $post->likes_count = $post->likes->count();
                $post->liked_by_user = $post->likes->where('user_id', Auth::id())->count() > 0;
                return $post;
            });

        return Inertia::render('Dashboard', [
            'posts' => $posts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'price' => 'nullable|numeric|min:0',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'content' => $validated['content'],
            'photo' => $photoPath,
            'price' => $validated['price'],
        ]);

        return response()->json($post, 201);
    }

    public function destroy(Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function likePost(Post $post)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
        
        $like = Like::where('user_id', $user->id)->where('post_id', $post->id)->first();

        if ($like){
            $like->delete();
            return response()->json(['message' => 'Like removed']);
        } else {
            $like = Like::create([
                'user_id' => $user->id,
                'post_id' => $post->id,
            ]);
            return response()->json(['message' => 'Post liked']);
        }
    }
    
}
