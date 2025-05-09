<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['post_id', 'name', 'address', 'payment_method', 'payment_status', 'buyer_id', 'seller_id', 'buyer_email', 'buyer_phone'];
    
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // Relationship with Buyer
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // Relationship with Seller
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
