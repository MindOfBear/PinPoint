<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
class StripePaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    
        $amount = $request->amount * 100;
    
        $paymentIntent = PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'eur',
            'payment_method_types' => ['card'],
        ]);
    
        return response()->json(['clientSecret' => $paymentIntent->client_secret]);
    }
}
