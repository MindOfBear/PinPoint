import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostFeed = ({ posts, auth, router }) => {
    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`/posts/${postId}/like`);
            if (response.status === 200) {
                router.reload({ only: ['posts'] });
            }
        } catch (error) {
            toast.error('Failed to like post.');
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(`/posts/${postId}`);
            toast.success("Post deleted successfully!");
            router.reload({ only: ['posts'] });
        } catch (error) {
            toast.error("Failed to delete post.");
        }
    };

    const handleRefresh = () => {
        router.reload({ only: ['posts'] });
    };

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg my-4">
                        <div className="p-6 text-gray-900">
                            <div className="text-gray-700 mb-1">{post.content}</div>
                            {post.photo && (
                                <div className="mt-2">
                                    <img 
                                        src={`/storage/${post.photo}`} 
                                        alt="Post photo" 
                                        className="w-full h-auto rounded" 
                                    />
                                </div>
                            )}
                            <div className="text-sm text-gray-500">{post.user?.name}</div>
                            <div className="flex gap-2 mt-2 justify-between">
                                <div>
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`px-3 py-1 ${post.liked_by_user ? 'bg-blue-800 scale-95' : 'bg-blue-500'} text-white rounded transition-all duration-300 transform`}
                                    >
                                        <i className="fa fa-thumbs-up"/>
                                    </button>
                                    <span className="text-gray-600 ml-2">{post.likes_count}</span>
                                </div>
                                {post.user?.id === auth?.user?.id && (
                                    <button 
                                        className="px-3 py-1 bg-red-500 text-white rounded" 
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <i className="fa fa-trash"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-gray-500">You have no posts</div>
            )}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 text-center">
                    <button 
                        onClick={handleRefresh} 
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Refresh Feed
                    </button>
                    <p className='mt-2 font-bold'>You reached the end of the feed...</p>
                </div>
            </div>
        </div>
    );
};

export default PostFeed;