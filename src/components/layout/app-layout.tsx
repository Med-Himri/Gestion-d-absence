import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/side-bar"
import Header from "@/components/layout/header"
export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden ">
            <Header />
            <main className="flex h-full">
                <div className="relative p-1 z-50">
                    
                        <Sidebar />
                        
                   
                </div>
                <div className="flex-1  relative px-4  ">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
