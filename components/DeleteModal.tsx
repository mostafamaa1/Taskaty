'use client';

import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useModalStore } from '@/store/modalStore';
import { useTaskStore } from '@/store/taskStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useLocale, useTranslations } from 'next-intl';

const DeleteModal = ({ socket }: { socket: Socket<DefaultEventsMap, DefaultEventsMap> }) => {
  const { toast } = useToast();
  const { setTaskToDelete, taskToDelete, deleteTask } = useTaskStore();
  const { setIsDeleteModalOpen, isDeleteModalOpen } = useModalStore();
  const { data: session } = useSession(); // Get session data
  const t = useTranslations('Dashboard');
  const localActive = useLocale();

  const handleCloseDeleteModal = () => {
    setTaskToDelete('');
    setIsDeleteModalOpen(false);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const res = await fetch('/api/tasks/crud', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`, // Include session token for authentication
          },
          body: JSON.stringify({ _id: taskToDelete }),
        });

        if (res.ok) {
          deleteTask(taskToDelete);
          toast({
            title: t('taskDeleted'),
            variant: 'destructive',
            className: 'bg-red-500 text-white',
            duration: 1500,
          });
            socket.emit('task:delete', {
              userName: session?.user.name || session?.user.email,
            });
        } 
      } catch (error) {
        console.error(error);
        toast({
          title: t('deleteErr'),
          variant: 'destructive',
          duration: 1500,
        });
      }

      setTaskToDelete('');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={handleCloseDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={localActive === 'ar' ? 'rtl text-right mr-4' : ''}>{t('confirmDelete')}</DialogTitle>
          <DialogDescription className={localActive === 'ar' ? 'rtl text-right' : ''}>
          {t('usure')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setIsDeleteModalOpen(false)}>
          {t('cancel')}
          </Button>
          <Button
            variant='destructive'
            onClick={handleDeleteTask}>
          {t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
