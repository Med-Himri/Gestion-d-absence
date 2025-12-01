
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
} from "lucide-react"
import { FormTeacher } from "@/components/layout/add-teacher"
import { useTeachersStore } from "@/store/teacher-store"
import { EditTeacher } from "@/components/layout/edit-teacher"

export default function TeachersPage() {

  const { teachers, loading, error, fetchTeachers,deleteTeacher} = useTeachersStore();
  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);


  if (loading) return <p>Loading...</p>


  return (
    <main className="flex  p-4 h-full">
      <div className=" w-full relative">

        <div className="bg-neutral-100 rounded-xl shadow p-6 dark:bg-neutral-800 absolute size-full overflow-auto">
          <div>
            <h1 className="font-semibold text-3xl">Teachers Management</h1>
          </div>
          <div className="flex items-center gap-6 mt-6">

            <div className="relative flex-1 max-w-[1200px]">
              <Input
                placeholder="Recherche..."
                // value={searchTerm}
                // onChange={(e) => handleSearch(e.target.value)}
                className="pl-4 pr-12 dark:bg-neutral-600 rounded-xl w-full bg-teal-50 border-blue-200 focus:border-blue-300"
              />
              <Button size="sm" className="absolute right-2 top-1 h-[28px] w-9 bg-teal-600 hover:bg-teal-600">
                <Search className="w-6 h-7 dark:text-neutral-200" />
              </Button>
            </div>
            <FormTeacher />
          </div>

          {/* Table */}
          <div className="flex-1 py-8 ">
            <div className="bg-white rounded  dark:bg-neutral-700 border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:text-neutral-300 dark:bg-neutral-700">
                    <TableHead className="font-medium  dark:text-neutral-300 text-neutral-700">Name</TableHead>
                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Email</TableHead>
                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Course</TableHead>                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Croups Assigned</TableHead>
                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.user_id} >
                      <TableCell className="font-medium dark:text-neutral-400  text-neutral-900">{teacher.name}</TableCell>
                      <TableCell className="text-neutral-700 dark:text-neutral-400">{teacher.email}</TableCell>
                      <TableCell className="text-neutral-700 dark:text-neutral-400">{teacher.course_names || "No course assigned"}</TableCell>
                      <TableCell className="text-neutral-700 dark:text-neutral-400">{teacher.groups.length > 0 ? teacher.groups.join(', ') : 'No groups assigned'}</TableCell>
                      <TableCell className="text-neutral-700">

                        <EditTeacher teacher={teacher} />

                        <button
                          onClick={() => deleteTeacher(teacher.user_id)}
                          className="px-3 py-1 dark:text-red-400 text-red-600"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


