import DashboardPage from "@/app/pages/dashboard-page"
import TeachersPage from "@/app/pages/teachers-page"
import GroupsPage from "@/app/pages/groups-page"
import FieldPage from "@/app/pages/field-page"
import StudentPage from "@/app/pages/student-page"
import CoursePage from "@/app/pages/course-page"
export const appRoutes = [
    {
        path: "/",
        component: <DashboardPage />,
    },
    {
        path: "/teachers",
        component: <TeachersPage />,
    },
     {
        path: "/groups",
        component: <GroupsPage />,
    },
     {
        path: "/field",
        component: <FieldPage />,
    },
     {
        path: "/students",
        component: <StudentPage />,
    },
     {
        path: "/course",
        component: <CoursePage />,
    },
   

] 