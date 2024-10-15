'use client';

import { format } from 'date-fns';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import EditDeleteMenu from './EditDeleteMenu';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';
import { TaskPriority, TaskStatus } from '@/types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useLocale, useTranslations } from 'next-intl';

const Tasklist = ({socket}: {socket: Socket<DefaultEventsMap, DefaultEventsMap>}) => {
  const { toast } = useToast();
  const { tasks, updateTask } = useTaskStore();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>(
    'all',
  );
  const [sortBy, setSortBy] = useState<
    'title' | 'priority' | 'dueDate' | 'none'
  >('none');
  const { data: session } = useSession();
  const t = useTranslations('Dashboard'); // Using t function for translations
  const localActive = useLocale(); // Getting current locale

  const filteredTasks = tasks
    ? tasks.filter(
        (task) =>
          (statusFilter === 'all' || task.status === statusFilter) &&
          (priorityFilter === 'all' || task.priority === priorityFilter),
      )
    : [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title')
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);

    if (sortBy === 'priority') {
      const priorityOrder = { Low: 0, Medium: 1, High: 2 };
      return sortOrder === 'asc'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortBy === 'dueDate') {
      if (!(a.dueDate instanceof Date)) return sortOrder === 'asc' ? 1 : -1;
      if (!(b.dueDate instanceof Date)) return sortOrder === 'asc' ? -1 : 1;

      return sortOrder === 'asc'
        ? a.dueDate.getTime() - b.dueDate.getTime()
        : b.dueDate.getTime() - a.dueDate.getTime();
    }

    return 0;
  });

  return (
    <div>
      {/* Filters  */}
      <div className='mb-4 flex flex-wrap gap-4 justify-start'>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as TaskStatus | 'all')
          }>
          <SelectTrigger className='w-fit px-4 bg-background dark:bg-secondary '>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent className={localActive === 'ar' ? 'rtl text-right' : ''}>
            <SelectItem value='all'>{t('statuses')}</SelectItem>
            <SelectItem value='To Do'>{t('todo')}</SelectItem>
            <SelectItem value='In Progress'>{t('inprogress')}</SelectItem>
            <SelectItem value='Completed'>{t('completed')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={priorityFilter}
          onValueChange={(value) =>
            setPriorityFilter(value as TaskPriority | 'all')
          }>
          <SelectTrigger className='w-fit px-4 bg-background dark:bg-secondary '>
            <SelectValue placeholder='Filter by priority' />
          </SelectTrigger>
          <SelectContent className={localActive === 'ar' ? 'rtl text-right' : ''}>
            <SelectItem value='all'>{t('priorities')}</SelectItem>
            <SelectItem value='Low'>{t('low')}</SelectItem>
            <SelectItem value='Medium'>{t('medium')}</SelectItem>
            <SelectItem value='High'>{t('high')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as 'title' | 'priority' | 'dueDate' | 'none')
          }>
          <SelectTrigger className='w-fit px-4 bg-background dark:bg-secondary '>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent className={localActive === 'ar' ? 'rtl text-right' : ''}>
            <SelectItem value='none'>{t('nosort')}</SelectItem>
            <SelectItem value='title'>{t('title')}</SelectItem>
            <SelectItem value='priority'>{t('priority')}</SelectItem>
            <SelectItem value='dueDate'>{t('duedate')}</SelectItem>
          </SelectContent>
        </Select>
        {sortBy !== 'none' && (
          <Button
            variant='outline'
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? t('asc') : t('desc')}
          </Button>
        )}
      </div>

      {/* Tasks */}
      <div className='  py-4 space-y-2'>
        {sortedTasks.length == 0 ? (
          <div className='text-center text-gray-500 dark:text-gray-400 mt-6'>
           {t('notasks')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tasks')}</TableHead>
                <TableHead className='text-nowrap'>{t('duedate')}</TableHead>
                <TableHead>{t('priority')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className='text-right'>{t('menu')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow
                  key={task._id}
                  className=''>
                  <TableCell className='space-y-2  text-nowrap w-1/2 capitalize'>
                    <div>
                      <h3 className='font-semibold text-base   '>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className='text-xs md:text-s text-gray-500 dark:text-gray-400 mt-1'>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-nowrap '>
                    {task.dueDate
                      ? format(task.dueDate, 'MMM d, yyyy')
                      : t('noduedate')}
                  </TableCell>
                  <TableCell className='text-nowrap'>{task.priority === 'High' ? t('high') : task.priority === 'Medium' ? t('medium'): t('low')}</TableCell>
                  <TableCell className='text-nowrap  '>
                    <Select
                      value={task.status}
                      onValueChange={async (value) => {
                        const url = '/api/tasks/crud';
                        const headers = {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ ...task, status: value }),
                        };
                        const res = await fetch(url, headers);
                        const data = await res.json();

                        updateTask({ ...task, status: value as TaskStatus });
                        toast({
                          title: t('taskUpdated'),
                          variant: 'default',
                          className: 'bg-green-400 text-black',
                          duration: 1500,
                        });
                        // Connect to the socket server and emit the update event
                        socket.emit('task:update', {
                          userName: session?.user.name || session?.user.email,
                        });
                      }}>
                      <SelectTrigger className={` bg-background } `}>
                        <SelectValue placeholder={t('status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t('status')}</SelectLabel>
                          <SelectItem value='To Do'>{t('todo')}</SelectItem>
                          <SelectItem value='In Progress'>
                          {t('inprogress')}
                          </SelectItem>
                          <SelectItem value='Completed'>{t('completed')}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className='text-right '>
                    <EditDeleteMenu task={task} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  className='text-left text-sm'
                  colSpan={5}>
                  {t('total')} : {sortedTasks.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Tasklist;
