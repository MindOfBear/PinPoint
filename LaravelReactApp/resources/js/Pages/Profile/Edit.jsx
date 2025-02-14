import { use, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Head } from '@inertiajs/react';
import PostFeed from '@/Components/PostFeed';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { posts=[], auth } = usePage().props;
    const [isVisible, setIsVisible] = useState(false);
    console.log(usePage().props);
    console.log("Sa logat")
    console.log( auth );

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
                {posts && posts.length > 0 ? (
                    <PostFeed posts={posts} auth={auth} />
                ) : (
                    <p>No posts available</p>
                )}

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
            </div>
        </AuthenticatedLayout>
    );
}