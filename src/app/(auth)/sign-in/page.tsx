import { LoginForm } from './form';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col p-4 md:w-1/3 w-full mx-auto mt-24">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Sign in</h1>
                <p className="text-gray-500">
                    Enter your email below to sing in to your account
                </p>
            </div>
            <div className="mt-6">
                <LoginForm />
            </div>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link className="underline" href="/sign-up">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
