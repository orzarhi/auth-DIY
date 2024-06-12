import Link from 'next/link';
import { SignUpForm } from './form'

export default function Page() {
    return (
        <div className="flex flex-col p-4 md:w-1/3 w-full mx-auto mt-24">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Create an account</h1>
                <p className="text-gray-500">Enter your information to get started</p>
            </div>
            <div className="mt-6">
                <SignUpForm />
            </div>
            <div className="mt-6 text-center text-sm">
                Already have an account?{' '}
                <Link className="underline" href="/sign-in">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
