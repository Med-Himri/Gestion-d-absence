
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
} from "lucide-react"
import {FormField} from "@/components/layout/add-fieled"
import { useFieldStore } from "@/store/field-store"
import { EditField } from "@/components/layout/edit-field"

export default function FieldPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const {fields, loading, fetchFields,deleteField } = useFieldStore()

  useEffect(() => {
    fetchFields()
  }, [fetchFields])

    if (loading) return <p>Loading...</p>
  return (
    <main className="flex  p-4 h-full">
      <div className=" w-full relative">

        <div className="bg-neutral-100 rounded-xl shadow p-6 dark:bg-neutral-800 absolute size-full overflow-auto">
          <div>
            <h1 className="font-semibold text-3xl">Field Management</h1>
          </div>
          <div className="flex items-center gap-6 mt-6">

            <div className="relative flex-1 max-w-[1200px]">
              <Input
                placeholder="Recherche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 dark:bg-neutral-600 rounded-xl w-full bg-teal-50 border-blue-200 focus:border-blue-300"
              />
              <Button size="sm" className="absolute right-2 top-0 h-[4vh] w-9 bg-teal-600 hover:bg-teal-600">
                <Search className="w-6 h-6 dark:text-neutral-200" />
              </Button>
            </div>
           <FormField/>
          </div>

          {/* Table */}
          <div className="flex-1 py-8 ">
            <div className="bg-white rounded  dark:bg-neutral-700 border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:text-neutral-300 dark:bg-neutral-700">
                    <TableHead className="font-medium  dark:text-neutral-300 text-neutral-700">Field Name</TableHead>
                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Groups</TableHead>
                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Number of Groups</TableHead>
                    <TableHead className="font-medium dark:text-neutral-300 text-neutral-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id} >
                      <TableCell className="font-medium dark:text-neutral-400  text-neutral-900">{field.name}</TableCell>
                      <TableCell className="text-neutral-700 dark:text-neutral-400">{field.groups?.map((g) => g.name).join(", ") || "-"}</TableCell>
                      <TableCell className="text-neutral-700 dark:text-neutral-400">{field.groups?.length || 0}</TableCell>
                      <TableCell className="text-neutral-700">
                         <EditField field={field} />

                        <button
                          onClick={() => deleteField(field.id)}
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


