import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#091d28', color: '#d49a30' }}>
      <aside className="w-64 p-4 border-r">
        <nav>
          <Link href="/dashboard/tasks" className="block py-2 hover:underline">
            Tasks
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}
