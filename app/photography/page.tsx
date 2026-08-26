import Sidebar from '@/components/Sidebar';

export default function photography() {
  return (
    <main className="flex flex-row h-full">
      <Sidebar />
      <div className="content flex flex-grow justify-center items-center">
        <p>Select something...</p>
      </div>
    </main>
  )
}
