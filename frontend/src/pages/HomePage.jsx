import { BottomNavigation, LeftSidebar, TopBar } from "@/components/Sidebar "

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <LeftSidebar />
      <BottomNavigation />
    </div>
  )
}

export default HomePage
