'use client'; // Indicates that this page should be rendered on the client-side

import Link from 'next/link'; // Importing Link for client-side navigation
import { useState, FormEvent, useEffect } from 'react'; // Importing React hooks for state management and side effects
import { useRouter } from 'next/navigation'; // Importing useRouter for client-side routing
import { signIn } from 'next-auth/react'; // Importing signIn function for authentication
import { Button } from '@/components/ui/button'; // Importing Button component
import { Input } from '@/components/ui/input'; // Importing Input component
import { Label } from '@/components/ui/label'; // Importing Label component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Importing Card components
import { useSession } from 'next-auth/react'; // Importing useSession hook for session management
import { useToast } from '@/hooks/use-toast'; // Importing useToast hook for toast notifications
import { io, Socket } from 'socket.io-client'; // Importing Socket.IO client for real-time communication
import { DefaultEventsMap } from '@socket.io/component-emitter'; // Importing DefaultEventsMap for Socket.IO events
let socket: Socket<DefaultEventsMap, DefaultEventsMap>; // Initializing Socket.IO client
import { useTranslations } from 'next-intl'; // Importing useTranslation hook for internationalization
import LangSwitcher from '@/components/ui/LangSwitcher';

function Page() {
  const router = useRouter(); // Initializing useRouter for client-side routing
  const { data: session } = useSession(); // Using useSession hook to get the current session
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  }); // Initializing state for login information
  const [loading, setLoading] = useState(false); // Initializing state for loading indicator
  const { toast } = useToast(); // Initializing toast hook for notifications
  const t = useTranslations('login'); // Initializing useTranslation hook for translations

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target; // Extracting input name and value
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    }); // Updating loginInfo state with new input values
  };

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push('/'); // Redirecting to the home page if the user is already logged in
    }
  }, [session, router]);

  // Handle form submission with NextAuth signIn method
  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Preventing the default form submission behavior
    setLoading(true); // Setting loading indicator to true
    const res = await signIn('credentials', {
      email: loginInfo.email,
      password: loginInfo.password,
      redirect: false, // Avoid automatic redirects, handle it manually
    });

    if (res?.error) {
      toast({
        title: t('login_failed'),
        description: res.error, // Displaying the error message from NextAuth
        variant: 'default',
        className: 'bg-red-400 text-black',
        duration: 1500,
      }); // Displaying a toast notification for login failure
    } else {
      toast({
        title: t('login_success'),
        description: t('login_success_desc'),
        variant: 'default',
        className: 'bg-green-400 text-black',
        duration: 1500,
      }); // Displaying a toast notification for login success
      // Connect to the socket server and emit the login event
      socket = io('http://localhost:3000');
      socket.emit('user:login', { name: loginInfo.email });
      router.push('/'); // Redirecting to the home page after successful login
    }

    setLoading(false); // Setting loading indicator to false after the operation
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 bg-muted'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            {t('login')}
          </CardTitle>
          <CardDescription className='text-center'>
            {t('welcome')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='space-y-4'
            onSubmit={submitForm}>
            <div className='space-y-2'>
              <Label htmlFor='email'> {t('Email')}</Label>
              <Input
                id='email'
                type='email'
                placeholder={t('EnterEmail')}
                name='email'
                onChange={handleChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'> {t('Password')}</Label>
              <Input
                id='password'
                type='password'
                placeholder={t('EnterPassword')}
                name='password'
                autoComplete='on'
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out'>
              {t('signIn')}
            </Button>
          </form>
          <div className='pt-4'>
            <p className='text-center'>
              {t('NoAccount')}{' '}
              <Link
                href='/register'
                className='text-blue-600 hover:underline'>
               {t('signUp')}
              </Link>
            </p>
          </div>
          <div className='pt-4'>
            <p className='text-center'>
              {t('ChangeLanguage')} <LangSwitcher />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
