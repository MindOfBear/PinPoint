import { useState, useEffect } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Map from '@/Components/Map';
import TrueFocus from '@/Components/Countup';
import 'font-awesome/css/font-awesome.min.css';
import PostFeed from '@/Components/PostFeed';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51RMc7AP5kbCjdYcNTAIwdv92R6f9mUSDWgG2iOX4sspUM6TMsV8zNXYjIob1flLyNczXyAjVFJ0zsROdPaAOiNDz00AHE4fv2N');

const Dashboard = () => {
    const { posts, auth } = usePage().props;
    console.log(usePage().props);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');
    const [userLocation, setUserLocation] = useState([44.3302, 23.7949]);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState('');

    const [buyingPost, setBuyingPost] = useState(null);
    const [buyerName, setBuyerName] = useState('');
    const [buyerAddress, setBuyerAddress] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('ramburs');

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
      if (paymentMethod === 'card' && buyingPost) {
        axios.post('/create-payment-intent', {
          amount: buyingPost.price
        }).then(res => {
          setClientSecret(res.data.clientSecret);
        });
      }
    }, [paymentMethod, buyingPost]);

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported.");
            setLocationLoaded(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setLocationLoaded(true);
            },
            (error) => {
                toast.error("Location permission denied.");
                setLocationLoaded(true);
            }
        );
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        if (locationLoaded) {
            router.reload({ 
                only: ['posts'], 
                data: { latitude: userLocation[0], longitude: userLocation[1] } 
            });
        }
    }, [locationLoaded]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const [latitude, longitude] = userLocation;
        
        const formData = new FormData();
        formData.append('content', content);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('price', price);
        
        if (file) {
            const img = new Image();
            const reader = new FileReader();
    
            reader.onload = () => {
                img.src = reader.result;
    
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1080;
                    let width = img.width;
                    let height = img.height;
    
                    if (width > MAX_WIDTH) {
                        height = (height * MAX_WIDTH) / width;
                        width = MAX_WIDTH;
                    }
                    if (height > MAX_HEIGHT) {
                        width = (width * MAX_HEIGHT) / height;
                        height = MAX_HEIGHT;
                    }
    
                    canvas.width = width;
                    canvas.height = height;
    
                    ctx.drawImage(img, 0, 0, width, height);
    
                    canvas.toBlob((blob) => {
                        formData.append('photo', blob, 'resized-image.jpg');
                        
                        axios.post('/posts', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then(() => {
                            setContent('');
                            setFile(null);
                            setShowForm(false);
                            toast.success('Post created!');
                            router.reload({ only: ['posts'] });
                        })
                        .catch(() => {
                            toast.error('Failed to create post.');
                        });
                    }, 'image/jpeg', 0.75);
                };
            };
            
            reader.readAsDataURL(file);
        } else {
            axios.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                setContent('');
                setShowForm(false);
                toast.success('Post created!');
                router.reload({ only: ['posts'] });
            })
            .catch(() => {
                toast.error('Failed to create post.');
            });
        }
    };

    const handleBuySubmit = async (e) => {
        e.preventDefault();
        if (!buyingPost) return;
    
        if (paymentMethod === 'card') {
            if (!clientSecret) {
                toast.error('Payment not initialized.');
                return;
            }

            const stripe = window.Stripe(stripePromise);
            const elements = stripe.elements();
            const cardElement = elements.getElement(CardElement);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: buyerName,
                        address: {
                            line1: buyerAddress,
                        },
                    },
                },
            });

            if (error) {
                toast.error('Payment failed: ' + error.message);
            } else if (paymentIntent.status === 'succeeded') {
                // Plată reușită
                try {
                    await axios.post('/orders', {
                        post_id: buyingPost.id,
                        seller_id: buyingPost.user.id,
                        buyer_id: auth.user.id,
                        name: buyerName,
                        address: buyerAddress,
                        buyer_phone: buyerPhone,
                        buyer_email: buyerEmail,
                        payment_method: paymentMethod,
                        payment_status: 'success',
                    });
                    toast.success('Order placed successfully!');
                    setBuyingPost(null);
                    setBuyerName('');
                    setBuyerAddress('');
                    setBuyerPhone('');
                    setBuyerEmail('');
                } catch (error) {
                    toast.error('Failed to place order.');
                }
            } else {
                toast.error('Payment failed.');
            }
            return;
        }
    
    
        if (paymentMethod === 'ramburs') {
            try {
                await axios.post('/orders', {
                    post_id: buyingPost.id,
                    seller_id: buyingPost.user.id,
                    buyer_id: auth.user.id,
                    name: buyerName,
                    address: buyerAddress,
                    buyer_phone: buyerPhone,
                    buyer_email: buyerEmail,
                    payment_method: paymentMethod,
                });
                toast.success('Order placed successfully!');
                setBuyingPost(null);
                setBuyerName('');
                setBuyerAddress('');
                setBuyerPhone('');
                setBuyerEmail('');
            } catch (error) {
                toast.error('Failed to place order.');
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-md font-semibold leading-tight text-gray-800">The place where you can see all the listenings on the market...</h2>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Create a post
                    </button>
                </div>
            }
        >
            <Head title="Market" />
            <ToastContainer />

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg text-center font-semibold mb-4">Create a post!</h3>
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Ad description..."
                            />
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                            />
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Price (EUR)"
                                min="0"
                                step="0.01"
                            />
                            <div className="flex justify-between">
                                <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                                    Post
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {buyingPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg text-center font-semibold mb-4">Complete your order</h3>
                        <div className="mb-4">
                            {buyingPost.photo_url && (
                                <img src={buyingPost.photo_url} alt="Post" className="w-full h-48 object-cover rounded mb-2" />
                            )}
                            <h4 className="text-lg font-semibold">{buyingPost.content}</h4>
                            <p className="text-sm text-gray-500">Published: {new Date(buyingPost.created_at).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">By: {buyingPost.user?.name}</p>
                        </div>
                        {paymentMethod === 'ramburs' ? (
                          <form onSubmit={handleBuySubmit}>
                            <input
                              type="text"
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded mb-4"
                              placeholder="Full name"
                              required
                            />
                            <textarea
                              value={buyerAddress}
                              onChange={(e) => setBuyerAddress(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded mb-4"
                              placeholder="Address"
                              required
                            />
                            <input
                              type="tel"
                              value={buyerPhone}
                              onChange={(e) => setBuyerPhone(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded mb-4"
                              placeholder="Phone number"
                              required
                            />
                            <input
                              type="email"
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded mb-4"
                              placeholder="Email adress"
                              required
                            />
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded mb-4"
                            >
                              <option value="ramburs">Ramburs</option>
                              <option value="card">Card</option>
                            </select>
                            <div className="flex justify-between">
                              <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                                Place Order
                              </button>
                              <button type="button" onClick={() => setBuyingPost(null)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <Elements stripe={stripePromise}>
                            {clientSecret && (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  value={buyerName}
                                  onChange={(e) => setBuyerName(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded mb-4"
                                  placeholder="Your name"
                                  required
                                />
                                <textarea
                                  value={buyerAddress}
                                  onChange={(e) => setBuyerAddress(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded mb-4"
                                  placeholder="Your address"
                                  required
                                />
                                <input
                                  type="tel"
                                  value={buyerPhone}
                                  onChange={(e) => setBuyerPhone(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded mb-4"
                                  placeholder="Phone number"
                                  required
                                />
                                <input
                                  type="email"
                                  value={buyerEmail}
                                  onChange={(e) => setBuyerEmail(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded mb-4"
                                  placeholder="Email address"
                                  required
                                />
                                <select
                                  value={paymentMethod}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded mb-4"
                                >
                                  <option value="ramburs">Ramburs</option>
                                  <option value="card">Card</option>
                                </select>
                                <CheckoutForm
                                    clientSecret={clientSecret}
                                    amount={buyingPost.price}
                                    onSuccess={async () => {
                                        console.log('Payment successful!');
                                        
                                        console.log('Posting order:', {
                                            post_id: buyingPost.id,
                                            seller_id: buyingPost.user.id,
                                            buyer_id: auth.user.id,
                                            name: buyerName,
                                            address: buyerAddress,
                                            buyer_phone: buyerPhone,
                                            buyer_email: buyerEmail,
                                            payment_method: 'card',
                                            payment_status: 'success',
                                        });
                                        try {
                                            await axios.post('/orders', {
                                                post_id: buyingPost.id,
                                                seller_id: buyingPost.user.id,
                                                buyer_id: auth.user.id,
                                                name: buyerName,
                                                address: buyerAddress,
                                                buyer_phone: buyerPhone,
                                                buyer_email: buyerEmail,
                                                payment_method: 'card',
                                                payment_status: 'success',
                                            });
                                            toast.success('Order has been placed succesfully!');
                                            setBuyingPost(null);
                                            setBuyerName('');
                                            setBuyerAddress('');
                                            setBuyerPhone('');
                                            setBuyerEmail('');
                                        } catch (error) {
                                            toast.error('Failed to place order.');
                                        }
                                    }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setBuyingPost(null)}
                                  className="text-sm text-gray-600 hover:text-gray-800 text-center mt-5"
                                >
                                <i className="fa fa-times"></i> Cancel
                                </button>
                              </div>
                            )}
                          </Elements>
                        )}
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-4">
                            <PostFeed posts={posts} auth={auth} router={router} onBuy={setBuyingPost} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div 
                                    className="bg-blue-500 aspect-square rounded-lg flex items-center justify-center border-4 border-blue-200" 
                                    style={{ filter: showForm ? 'blur(5px)' : 'none' }}
                                >
                                    <Map posts={posts} />
                                </div>
                            <div className="border-blue-300 border-4 aspect-square rounded-lg flex items-center justify-center">
                                <TrueFocus 
                                    sentence="PinPoint and make the deal!"
                                    manualMode={false}
                                    blurAmount={3}
                                    borderColor="blue"
                                    animationDuration={2}
                                    pauseBetweenAnimations={0.5}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;