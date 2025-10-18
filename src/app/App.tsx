import AppLayout from "@/components/layout/app-layout"
import { appRoutes } from "@/routes"
import { Route, Routes } from "react-router-dom"
import LoginPage from "@/app/auth/login-page"

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
            </Routes>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    {appRoutes.map((route, key) => (
                        <Route key={key} path={route.path} element={route.component} />
                    ))}
                </Route>
            </Routes>
        </>
    )
}

export default App