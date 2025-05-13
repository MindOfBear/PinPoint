<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
    {
        public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'payment_method' => 'string|in:ramburs,card',
            'payment_status' => 'string|in:success,pending,failed',
            'buyer_id' => 'required|exists:users,id',
            'seller_id' => 'required|exists:users,id',
            'buyer_email' => 'required|email',
            'buyer_phone' => 'required|string|max:20',
        ]);

        Log::info('Validated order data:', $validated);

        try {
            $order = Order::create($validated);
            return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }
    public function accept(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if (now()->diffInHours($order->created_at) > 48) {
            return redirect()->back()->with('error', 'Order can no longer be accepted.');
        }

        $order->is_accepted = true;
        $order->save();

        return redirect()->back()->with('success', 'Order accepted successfully.');
    }
}
