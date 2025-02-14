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

    const { posts, auth, test } = usePage().props;

    console.log(auth);
    
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
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
            </div>
        </AuthenticatedLayout>
    );
}