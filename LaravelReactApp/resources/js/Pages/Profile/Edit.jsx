import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Head, router } from '@inertiajs/react';
import PostFeed from '@/Components/PostFeed';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Edit({ mustVerifyEmail, status }) {
    const { posts, auth, buyer_orders, seller_orders } = usePage().props;

    const [activeSection, setActiveSection] = useState('posts');
    const [isVisible, setIsVisible] = useState(false);
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    const handleImageClick = () => {
        setIsImageEnlarged(!isImageEnlarged);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profile
                    </h2>
                    <i 
                        id='toggleIcon' 
                        className={`fa fa-gear ${isVisible ? 'hover:animate-spin' : 'scale-150'}`}
                        onClick={handleToggle}
                    />
                </div>
            }
        >
            <Head title="Profile" />
            <ToastContainer />
            <div className="py-12">
                {/* Buttons to switch between sections */}
                <div className="flex justify-center mb-5 space-x-4">
                    <button 
                        onClick={() => setActiveSection('posts')}
                        className={`px-2 py-1 rounded-2xl border border-blue-300 shadow-md ${activeSection === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <i className="fa fa-book"></i> Posts
                    </button>
                    <button 
                        onClick={() => setActiveSection('purchases')}
                        className={`px-2 rounded-2xl border border-blue-300 shadow-md ${activeSection === 'purchases' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <i className="fa fa-shopping-cart"></i> Purchases
                    </button>
                    <button 
                        onClick={() => setActiveSection('sales')}
                        className={`px-2 rounded-2xl border border-blue-300 shadow-md ${activeSection === 'sales' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <i className="fa fa-dollar"></i> Sales
                    </button>
                </div>

                {/* Display the correct section */}
                {activeSection === 'posts' && (
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        {posts && posts.length > 0 ? (
                            <div>
                                <p className="text-md font-semibold ml-5">{auth?.user?.name}</p>
                                <p className="text-sm font-normal ml-5 mb-4">{auth?.user?.email}</p>
                                <PostFeed posts={posts} auth={auth} router={router} />
                            </div>
                        ) : (
                            <p className='text-md text-center font-semibold'>You don't have any posts yet...</p>
                        )}
                    </div>
                )}

                {activeSection === 'purchases' && (
                    <div className="mt-10 flex justify-center">
                        <div className="bg-white p-6 shadow-lg rounded-md w-full max-w-3xl">
                            <h3 className="text-lg font-semibold">Your Purchases</h3>
                            {buyer_orders && buyer_orders.length > 0 ? (
                                <div className="bg-white p-4 shadow-lg sm:rounded-lg sm:p-8">
                                    {buyer_orders.map((order) => (
                                        <div key={order.id} className="border-b mb-4 flex items-center justify-between py-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-700"><strong>Post:</strong> {order.post ? order.post.content : 'Unknown'}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Seller:</strong> {order.seller ? order.seller.name : 'Unknown'}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Payment Method:</strong> {order.payment_method}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Status:</strong> {order.payment_status === 'success' ? <i className="fa fa-check-circle text-green-500"></i> : <i className="fa fa-times-circle text-red-500"></i>}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                {order.post && order.post.photo && (
                                                    <img 
                                                        src={`/storage/${order.post.photo}`} 
                                                        alt="Post image" 
                                                        className={`w-24 h-24 object-cover rounded-md shadow-md cursor-pointer ${isImageEnlarged ? 'w-48 h-48' : ''}`} 
                                                        onClick={handleImageClick}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-md text-center font-semibold'>You haven't made any purchases yet...</p>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'sales' && (
                    <div className="mt-10 flex justify-center">
                        <div className="bg-white p-6 shadow-lg rounded-md w-full max-w-3xl">
                            <h3 className="text-lg font-semibold">Your Sales</h3>
                            {seller_orders && seller_orders.length > 0 ? (
                                <div className="bg-white p-4 shadow-lg sm:rounded-lg sm:p-8">
                                    {seller_orders.map((order) => (
                                        <div key={order.id} className="border-b mb-4 flex items-center justify-between py-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-700 mb-1"><strong>Order: </strong>{order.post ? order.post.content : 'Unknown'}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Buyer Name:</strong> {order.buyer ? order.buyer.name : 'Unknown'}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Delivery Address</strong> {order.address}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Amount:</strong> {order.post.price} EUR</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Payment Method:</strong> {order.payment_method}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Payment Status:</strong> {order.payment_status === 'success' ? <i className="fa fa-check-circle text-green-500"></i> : <i className="fa fa-times-circle text-red-500"></i>}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                {order.post && order.post.photo && (
                                                    <img 
                                                        src={`/storage/${order.post.photo}`} 
                                                        alt="Post image" 
                                                        className={`w-24 h-24 object-cover rounded-md shadow-md cursor-pointer ${isImageEnlarged ? 'w-48 h-48' : ''}`} 
                                                        onClick={handleImageClick}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-md text-center font-semibold'>You haven't sold anything yet...</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}