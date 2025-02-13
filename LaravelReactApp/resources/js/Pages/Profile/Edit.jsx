import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {

    const [isVisible, setIsVisible] = useState(false);
    const handleToggle = () => {
        setIsVisible(!isVisible);
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
            <div className="py-12">
                <div id='toggleDiv' className={`${isVisible ? '' : 'hidden'}`}>
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className='flex items-center'>
                            <i className='fa fa-gears'/>
                            <p className='text-xl ml-2'>You are viewing settings</p>

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
                </div>
                {/* }
                <div key={post.id} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="text-gray-700">{post.content}</div>
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
                { */}
            </div>
        </AuthenticatedLayout>
    );
}