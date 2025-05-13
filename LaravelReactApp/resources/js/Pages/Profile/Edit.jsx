import { useState } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
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
            {isVisible && (
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 mb-8">
                    <div className='flex items-center'>
                        <i className='fa fa-gears'/>
                        <p className='text-xl ml-2 mt-10'>You are viewing settings</p>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            )}
            <div className="py-12">
                
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
                                                <p className="text-sm font-medium text-gray-700"><strong>Amount: </strong>{order.post.price}€</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Payment Status:</strong> {order.payment_status === 'success' ? <i className="fa fa-check-circle text-green-500"></i> : <i className="fa fa-times-circle text-red-500"></i>}</p>
                                                <p className="text-sm font-medium text-gray-600">
                                                    <strong>Confirmation:</strong>{' '}
                                                    {!order.is_accepted && new Date() - new Date(order.created_at) >= 48 * 60 * 60 * 1000 ? (
                                                        <span className="text-red-600 font-semibold">Expired <p className='text-gray-500 flex flex-row'>(Seller did not accept order in 48h)</p></span>
                                                    ) : order.is_accepted ? (
                                                        <span className="text-green-600 font-semibold">Accepted</span>
                                                    ) : (
                                                        <span className="text-yellow-600 font-semibold">Pending</span>
                                                    )}
                                                </p>
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
                    <div className="mt-10 flex justify-center gap-10 items-start">
                        <div className="bg-white p-6 shadow-lg rounded-md w-full max-w-3xl">
                            <h3 className="text-lg font-semibold">Your Sales</h3>
                            {seller_orders && seller_orders.length > 0 ? (
                                <div className="bg-white p-4 shadow-lg sm:rounded-lg sm:p-8">
                                    {seller_orders.map((order) => (
                                        <div key={order.id} className="border-b mb-4 flex items-center justify-between py-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-700 mb-1"><strong>Order: </strong>{order.post ? order.post.content : 'Unknown'}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Buyer Name:</strong> {order.name}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Buyer Email:</strong> {order.buyer_email}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Buyer Phone:</strong> {order.buyer_phone}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Delivery Address</strong> {order.address}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Amount:</strong> {order.post.price} EUR</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Payment Method:</strong> {order.payment_method}</p>
                                                <p className="text-sm font-medium text-gray-600"><strong>Payment Status:</strong> {order.payment_status === 'success' ? <i className="fa fa-check-circle text-green-500"></i> : <i className="fa fa-times-circle text-red-500"></i>}</p>
                                                
                                                <p className="text-sm font-medium text-gray-600">
                                                    <strong>Confirmation:</strong>{' '}
                                                    {!order.is_accepted && new Date() - new Date(order.created_at) >= 48 * 60 * 60 * 1000 ? (
                                                        <span className="text-red-600 font-semibold">Expired (not accepted in 48h)</span>
                                                    ) : order.is_accepted ? (
                                                        <span className="text-green-600 font-semibold">Accepted</span>
                                                    ) : (
                                                        <span className="text-yellow-600 font-semibold">
                                                            Pending - {Math.max(0, 48 - Math.floor((new Date() - new Date(order.created_at)) / (1000 * 60 * 60)))}h left
                                                        </span>
                                                    )}
                                                </p>
                                                {!order.is_accepted && new Date() - new Date(order.created_at) < 48 * 60 * 60 * 1000 ? (
                                                    <button
                                                        onClick={() => {
                                                            router.post(`/orders/${order.id}/accept`, {}, {
                                                                onSuccess: () => toast.success('Order accepted successfully!'),
                                                                onError: () => toast.error('Failed to accept order.'),
                                                            });
                                                        }}
                                                        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                    >
                                                        Accept Order
                                                    </button>
                                                ) : (
                                                    !order.is_accepted && (
                                                        <button
                                                            className="mt-2 px-4 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                                                            disabled
                                                        >
                                                            Accept Expired
                                                        </button>
                                                    )
                                                )}
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
                        <div className="fixed rounded-2xl bottom-6 right-6 bg-white p-6 shadow-lg w-full max-w-xs z-50">
                            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                            <Doughnut data={{
                                labels: seller_orders.map(order => order.post.content),
                                datasets: [{
                                    label: 'Price',
                                    data: seller_orders.map(order => order.post.price || 0),
                                    backgroundColor: seller_orders.map((_, i) => `hsl(${i * 40 % 360}, 70%, 60%)`),
                                    borderWidth: 1
                                }]
                            }} />
                            <div className="mt-4 text-right text-sm font-semibold text-gray-800">
                                Total: {seller_orders.reduce((sum, o) => sum + Number(o.post?.price || 0), 0).toFixed(2)} EUR
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}