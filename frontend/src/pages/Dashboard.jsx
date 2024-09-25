import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidnav';



function DashboardLayout()
{
    return (
        <>
        <div className="flex flex-col h-screen bg-home_background">
      <div className="border-b-2 border-stone-400 h-16 text-gray-600 flex items-center justify-between p-4">
        <div className="flex items-center">
        {/* <Avatar name="User Name" src="https://bit.ly/broken-link" /> */}
          <span className="ml-2">{"User Name"}</span>
          </div>
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 justify-center flex-wrap px-56 py-10">
          
          <Outlet />
        </div>
      </div>
    </div></>
    )

} 
  

export default DashboardLayout;