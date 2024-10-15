'use client';

import Header from '@/components/Header';
import Kanban from '@/components/Kanban';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import Tasklist from '@/components/Tasklist';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/taskStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/animation/loader';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import DeleteModal from '@/components/DeleteModal';
import { useTranslations } from 'next-intl';
import AddUpdateModal from '@/components/AddUpdateModal';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>; // Initialize Socket.IO client

export default function Home() {
  const { boardView } = useDashboardStore();
  const { setTasks } = useTaskStore();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const t = useTranslations('Dashboard')
  const [isFetching, setIsFetching] = useState(true); // State to track fetching status

  useEffect(() => {
    // if(!socket.connected){}
    socket = io(process.env.NEXT_PUBLIC_APP_URL);
    // Emit user login event when connected
    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    // Listen for the 'notification' event to display toasts when a user logs in
    socket.on('user:login', (message: string) => {
      // Display the toast message to all connected users
      toast({
        title: t('userLoggedIn'),
        description: message, // Display the message sent by the server
        variant: 'default',
        className: 'bg-green-400 text-black',
        duration: 1500,
      });
    });

      // Listen for task-related events
      socket.on('task:add', (data: { userName: any; }) => {
        toast({
          title: `${t('addedBy')} ${data.userName}`,
          variant: 'default',
          className: 'bg-gray-400 text-white',
          duration: 1500,
        });
      });
      
      // Listen for task-related events
      socket.on('task:update', (data: { userName: any; }) => {
        toast({
          title: `${t('updatedBy')} ${data.userName}`,
          variant: 'default',
          className: 'bg-blue-400 text-black',
          duration: 1500,
        });
      });
      // Listen for task-related events
      socket.on('task:delete', (data: { userName: any; }) => {
        toast({
          title: `${t('deletedBy')} ${data.userName}`,
          variant: 'destructive',
          className: 'bg-red-500 text-white',
          duration: 1500,
        });
      });
    return () => {
      socket.off('task:add');
      socket.off('task:update');
      socket.off('task:delete');
      socket.off('user:login');
      socket.off('connect');
      socket.disconnect(); // Clean up the listener when component unmounts
    };
  }, []);

  const fetchTasks = async () => {
    if (!session) {
      console.log('No session available');
      return; // Don't fetch if there's no session
    }
    const url = '/api/tasks/crud';
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.token}`,
      },
    };

    try {
      const res = await fetch(url, headers);
      if (!res.ok) {
        const errorBody = await res.json(); // Log error response
        console.log('Error response:', errorBody);
        console.log('HTTP Error Status:', res.status);
        return; // Exit early if there's an error
      }

      const result = await res.json();
      setTasks(result.tasks);
      setIsFetching(false); // Stop fetching after tasks are fetched
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setIsFetching(false); // Stop fetching in case of an error
    }
  };

  // Redirect to login if no session
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      try {
        fetchTasks();
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  }, [session]);

  if (status === 'loading' || isFetching) {
    return <LoadingSpinner />; // Optional loading state
  }

  return (
    <>
      <div className='flex max-sm:flex-col h-screen bg-secondary dark:bg-background'>
        <Sidebar />
        <div className='flex-1 p-8 overflow-auto '>
          <Header />
          {boardView === 'list' ? (
            <Tasklist socket={socket} />
          ) : (
            <Kanban socket={socket} />
          )}
        </div>
      </div>
      <AddUpdateModal socket={socket} />
      <DeleteModal socket={socket} />
    </>
  );
}
