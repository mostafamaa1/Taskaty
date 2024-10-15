"use client"

import React from "react";
import {Task} from "@/types/types"
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";

const EditDeleteMenu = ({task}:{task:Task}) => {

    const { setTaskToDelete, setNewTask } = useTaskStore();
    const {  setIsDeleteModalOpen, setIsAddModalOpen } = useModalStore();
    const t = useTranslations('Dashboard');
    const localActive = useLocale();
    
return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setNewTask(task);
            setIsAddModalOpen(true);
          }}
        >
          {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTaskToDelete(task._id);
            setIsDeleteModalOpen(true);
          }}
        >
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditDeleteMenu;
