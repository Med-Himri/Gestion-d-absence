import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
    UserCheck,
    Layers,
    Home,
    BookOpen,
    BookOpenText,
    Users,
    FileText
} from "lucide-react";
import { Button } from "../ui/button";

export interface SidebarItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    badge?: number;
}

const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Accueil", href: "/" },
    { icon: UserCheck, label: "Teachers", href: "/teachers" },
    { icon: BookOpenText, label: "Course", href: "/course" },
    { icon: Users, label: "Student", href: "/students" },
    { icon: Layers, label: "Groups", href: "/groups" },
    { icon: BookOpen, label: "Field", href: "/field" },
    { icon: FileText, label: "Rapports", href: "/reports",  }
    

];
export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("/");
    const navigate = useNavigate();

    return (
        <div className="h-[92vh] flex flex-col justify-between p-3 dark:bg-neutral-800 bg-neutral-100 rounded-lg ">
            <nav className="flex flex-col items-center gap-y-6 mt-2 h-full">

                {sidebarItems.map((item) => {
                    const isActive = activeItem === item.href;
                    const Icon = item.icon;
                    return (
                        <TooltipProvider>
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Button
                                    
                                    onClick={() => {
                                        setActiveItem(item.href);
                                        navigate(item.href);

                                    }}
                                    size="icon"
                                    variant={isActive ? "default" : "secondary"}
                                    className={`dark:hover:bg-neutral-100 text-teal-50 hover:bg-teal-300 hover:text-neutral-700  ${isActive ? "bg-teal-950" : "bg-teal-600"}`}
                                >
                                    <Icon />

                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{item.label}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </nav>

        </div>
    );
}

