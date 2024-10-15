"use client";

import React from "react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import {Task} from "@/types/types"
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { useTaskStore } from "@/store/taskStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useTranslations } from "next-intl";

const Kanban = ({ socket }: { socket: Socket<DefaultEventsMap, DefaultEventsMap> }) => {

  const {toast} = useToast();
  const {tasks,setTasks} = useTaskStore();
  const { data: session } = useSession();
  const t = useTranslations('Dashboard');

  // update the task when it is dragged to a different column and update the status

  const updateTaskStatus = async (task:Task) => {
    try {
      const url = '/api/tasks/crud';
      const headers = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, status: task.status }),
      };
      const res = await fetch(url, headers);
      // const data = await res.json();
      if(res.ok) {
        toast({
          title: t('taskUpdated'),
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 1500,
        })
          // Connect to the socket server and emit the update event
          // socket = io('http://localhost:3000');
          socket.emit('task:update', {
            userName: session?.user.name || session?.user.email,
          });
      }
    } catch (error) {
      toast({
        title: t('updateErr'),
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 1500,
      })
      console.error("Error updating task status:", error);
    }
  };

  // drag and drop logic for kanban board
  const onDragEnd = (result:any) => {
    if (!result.destination) return;

    const draggedItemId = result.draggableId;
    const sourceColumn = result.source.droppableId;
    const destinationColumn = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // If the task is moved within the same column
    if (sourceColumn === destinationColumn) {
      const newTasks = Array.from(tasks);
      const [movedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, movedTask);
      setTasks(newTasks);
    } else {
      // Find the task that was dragged
      const taskIndex = tasks.findIndex((task) => task._id === draggedItemId);
      const updatedTask = { ...tasks[taskIndex], status: destinationColumn };

      // Create a new tasks array with the updated task
      const newTasks = [...tasks.slice(0, taskIndex),updatedTask,...tasks.slice(taskIndex + 1),];
      setTasks(newTasks);
      updateTaskStatus(updatedTask);
    }
  };



  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 justify-evenly max-lg:flex-wrap ">
        {["To Do", "In Progress", "Completed"].map((status) => (
          <div key={status} className="dark:bg-secondary bg-gray-200 p-4 rounded-lg w-full">
            <h3 className="font-semibold mb-4">{status}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[100px]"
                >
                  {tasks
                    .filter((task) => task.status === status)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-background p-4 rounded shadow flex justify-between"
                          >
                            <div className="flex flex-col items-start">
                              <Badge  className={"bg-primary"}>{task.priority}</Badge>
                              <div className="capitalize">
                                <h3 className="font-semibold text-lg ">{task.title}</h3>
                                {task.description && (<p className="text-sm text-gray-500 dark:text-gray-400 my-1">{task.description}</p>)}
                              </div>
                              <div className="flex gap-1">
                              {task.dueDate && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {format(task.dueDate, "MMM d, yyyy")}
                                  </div>
                                )}
                              </div>
                            </div>

                            <EditDeleteMenu task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
