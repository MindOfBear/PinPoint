import { useState } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export default function Dashboard() {
    const { posts } = usePage().props;

    console.log(usePage().props);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/posts', { content });
            setContent('');
            setShowForm(false);
            toast.success('Your post has been created!');
            router.reload({ only: ['posts'] });

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!');
        }
    };

    return (
        
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
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
                        <h3 className="text-lg text-center font-semibold mb-4">Post your toughts!</h3>
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Write your post..."
                            />
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                                >
                                    Post
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
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
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                        <div className="p-6 text-gray-900">
                                            <div className="text-gray-700">{post.content}</div>
                                            <div className="text-sm text-gray-500">{post.user?.name}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500">No posts available...</div>
                            )}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 text-center">
                                    <p className="text-gray-700">You’ve reached the end of the feed.</p>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                        Refresh Feed
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="bg-blue-500 aspect-square rounded-lg flex items-center justify-center">
                                mapa
                            </div>
                            <div className="bg-blue-500 aspect-square rounded-lg flex items-center justify-center">
                                Ceva
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
        
    );
}