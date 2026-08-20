import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { Topbar } from '@/components/topbar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <AppSidebar />
      <div className="ml-64 flex flex-1 flex-col transition-all duration-300">
        <Topbar />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
