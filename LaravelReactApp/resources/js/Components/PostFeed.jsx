import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';


const PostFeed = ({ posts, auth, router, onBuy }) => {
    const [visibleCount, setVisibleCount] = useState(20);
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = posts
        .filter(post => !showLikedOnly || post.liked_by_user)
        .filter(post =>
            post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const loadMorePosts = () => {
        setVisibleCount(prev => prev + 20);
    };

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
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
                <div className="flex flex-row items-center flex-1 max-w-lg">
                    <i className="fa fa-search text-gray-600 ml-2 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by name or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-lg text-sm h-1/2 w-full placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer select-none">
                    <i className={`fa fa-heart ${showLikedOnly ? 'text-red-500' : 'text-gray-500'}`} />
                    <input 
                        type="checkbox" 
                        id="showLikedOnly" 
                        checked={showLikedOnly} 
                        onChange={() => setShowLikedOnly(prev => !prev)} 
                        className="hidden"
                    />
                    <label htmlFor="showLikedOnly" className="text-sm text-gray-700 cursor-pointer">Favourites</label>
                </div>
            </div>
            {filteredPosts.length > 0 ? (
                filteredPosts.slice(0, visibleCount).map((post) => (
                    <div key={post.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg my-4">
                        <div className="p-6 text-gray-900">
                            <div className="text-sm text-gray-500 font-semibold">{post.user?.name}
                                <p className='text-xs text-gray-600 font-normal'>
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-gray-700 font-medium mt-1 ml-1">{post.content}</div>
                            {post.photo && (
                                <div className="mt-2 flex items-center justify-center">
                                    <img 
                                        src={`/storage/${post.photo}`} 
                                        alt="Post photo" 
                                        className="w-full h-auto max-w-[500px] max-h-auto object-cover rounded-lg shadow-lg border-2 border-transparent"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2 mt-2 justify-between items-center">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <button
                                            onClick={() => onBuy(post)}
                                            disabled={post.user?.id === auth?.user?.id}
                                            className={`px-3 py-1 text-white rounded transition-all duration-300 transform ${post.user?.id === auth?.user?.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
                                        >
                                            <i className="fa fa-shopping-cart mr-2"></i>
                                            <span className="font-medium">
                                                {post.price && post.price > 0 ? `${post.price} €` : 'Free'}
                                            </span>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            disabled={post.user?.id === auth?.user?.id}
                                            className={`px-3 py-1 text-white rounded transition-all duration-300 transform ${post.liked_by_user ? 'bg-blue-800 scale-95' : 'bg-blue-500'} ${post.user?.id === auth?.user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <i className="fa fa-heart"/>
                                        </button>
                                        <span className="text-gray-600 ml-2">{post.likes_count}</span>
                                    </div>
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
                <div className="text-gray-500 mt-5">You have no posts to see...</div>
            )}
            {visibleCount < filteredPosts.length ? (
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 text-center">
                        <p className='mt-2 font-bold text-lg animate-pulse'>Want to see more ads?</p>
                        <button 
                            onClick={loadMorePosts} 
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Load More
                            <i className="fa fa-chevron-down ml-2"></i>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 text-center">
                        <p className='mt-2 font-bold'>You reached the end of the feed...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostFeed;