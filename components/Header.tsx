"use client"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useModalStore } from "@/store/modalStore"
import { useDashboardStore } from "@/store/dashboardStore"
import { useTranslations } from "next-intl"

const Header = () => {

  const {setIsAddModalOpen} = useModalStore()
  const {boardView} = useDashboardStore()
  const t = useTranslations('Dashboard')

  return (

    <div className="mb-4 flex items-center justify-between  ">
          <h2 className="text-xl text-nowrap md:text-2xl  font-bold dark:text-white">{boardView === 'list' ? t('list_view') : t('kanban_view')}</h2>
          <Button size={`sm`} onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t('addTask')}
          </Button>
    </div>

  )
}

export default Header