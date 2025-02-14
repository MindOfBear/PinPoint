import { useState, useEffect, use } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Map from '@/Components/Map';
import TrueFocus from '@/Components/Countup';
import 'font-awesome/css/font-awesome.min.css';
import PostFeed from '@/Components/PostFeed';

const Dashboard = () => {
    const { posts, auth } = usePage().props;
    console.log(usePage().props);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');
    const [userLocation, setUserLocation] = useState([44.3302, 23.7949]);
    const [locationLoaded, setLocationLoaded] = useState(false);

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

        try {
            await axios.post('/posts', { content, latitude, longitude });
            setContent('');
            setShowForm(false);
            toast.success('Post created!');
            router.reload({ only: ['posts'] });
        } catch (error) {
            toast.error('Failed to create post.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Create a post
                    </button>
                </div>
            }
        >
            <Head title="Dashboard" />
            <ToastContainer />

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg text-center font-semibold mb-4">Post your thoughts!</h3>
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Write your post..."
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

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-4">
                            <PostFeed posts={posts} auth={auth} router={router} />
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
                                    sentence="PinPoint your Toughts"
                                    manualMode={false}
                                    blurAmount={3}
                                    borderColor="blue"
                                    animationDuration={2}
                                    pauseBetweenAnimations={1}
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