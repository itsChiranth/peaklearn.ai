"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type StudyPlan = {
  _id: string
  subject: string
  hoursPerDay: number
  completed: boolean
}

export function StudyPlanList() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudyPlans = async () => {
      try {
        const response = await apiClient.get("/api/study-plans")
        setStudyPlans(response.data.studyPlans)
      } catch (err: any) {
        setError("Failed to fetch study plans")
      } finally {
        setLoading(false)
      }
    }

    fetchStudyPlans()
  }, [])

  const toggleCompleted = async (id: string, completed: boolean) => {
    try {
      await apiClient.patch(`/api/study-plans/${id}`, { completed })
      setStudyPlans((plans) => plans.map((plan) => (plan._id === id ? { ...plan, completed } : plan)))
    } catch (err) {
      setError("Failed to update study plan")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (studyPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="mb-4 text-muted-foreground">You don't have any study plans yet</p>
        <Button asChild>
          <Link href="/dashboard?tab=upload">Upload a Document</Link>
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Hours Per Day</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studyPlans.map((plan) => (
          <TableRow key={plan._id}>
            <TableCell className="font-medium">{plan.subject}</TableCell>
            <TableCell>{plan.hoursPerDay}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Checkbox
                  checked={plan.completed}
                  id={`completed-${plan._id}`}
                  onCheckedChange={(checked) => toggleCompleted(plan._id, checked as boolean)}
                />
                <label htmlFor={`completed-${plan._id}`} className="ml-2 text-sm font-medium">
                  {plan.completed ? "Completed" : "In Progress"}
                </label>
              </div>
            </TableCell>
            <TableCell>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/study-plan/${plan._id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

