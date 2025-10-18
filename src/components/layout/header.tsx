
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex justify-between bg-neutral-100 dark:bg-neutral-800 py-2">
            <nav className="px-4 flex justify-between w-full ">
                <div className="flex h-full items-center space-x-1.5">
                       <h1 className="font-semibold text-2xl"> Gestion d'absence</h1>
                </div>
                <div className="flex items-center space-x-2">
                   
                    <div className="flex gap-x-4 ml-4">
                        <div>
                            <p className="text-sm text-neutral-800 dark:text-neutral-50 font-medium">MR Mohamed</p>
                            <p className="text-xs flex justify-center text-neutral-600 dark:text-neutral-400 -mt-0.5">Admin</p>
                        </div>
                
                    </div>
                </div>
            </nav>
        </header>
    );
}
