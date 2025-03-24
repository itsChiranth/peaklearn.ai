"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { apiClient } from "@/lib/api-client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

type StudyPlan = {
  _id: string
  subject: string
  hoursPerDay: number
  completed: boolean
  document: {
    _id: string
    filename: string
  }
  topics: Array<{
    title: string
    subtopics: string[]
    importance: number
    completed: boolean
  }>
}

export default function StudyPlanPage() {
  const { id } = useParams()
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const response = await apiClient.get(`/api/study-plans/${id}`)
        setStudyPlan(response.data.studyPlan)

        // Calculate progress
        const total = response.data.studyPlan.topics.length
        const completed = response.data.studyPlan.topics.filter((t: any) => t.completed).length
        setProgress(total > 0 ? (completed / total) * 100 : 0)
      } catch (err: any) {
        setError("Failed to fetch study plan")
      } finally {
        setLoading(false)
      }
    }

    fetchStudyPlan()
  }, [id])

  const toggleTopicCompleted = async (topicIndex: number, completed: boolean) => {
    if (!studyPlan) return

    try {
      await apiClient.patch(`/api/study-plans/${id}/topics/${topicIndex}`, { completed })

      const updatedTopics = [...studyPlan.topics]
      updatedTopics[topicIndex].completed = completed

      setStudyPlan({
        ...studyPlan,
        topics: updatedTopics,
      })

      // Recalculate progress
      const total = updatedTopics.length
      const completedCount = updatedTopics.filter((t) => t.completed).length
      setProgress(total > 0 ? (completedCount / total) * 100 : 0)

      // Check if all topics are completed
      if (completedCount === total) {
        await apiClient.patch(`/api/study-plans/${id}`, { completed: true })
        setStudyPlan({
          ...studyPlan,
          completed: true,
          topics: updatedTopics,
        })
      } else if (studyPlan.completed) {
        await apiClient.patch(`/api/study-plans/${id}`, { completed: false })
        setStudyPlan({
          ...studyPlan,
          completed: false,
          topics: updatedTopics,
        })
      }
    } catch (err) {
      setError("Failed to update topic status")
    }
  }

  if (loading) {
    return (
      <div className="container flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !studyPlan) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>{error || "Study plan not found"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{studyPlan.subject} Study Plan</h1>
        <p className="text-muted-foreground">
          {studyPlan.hoursPerDay} hours per day |{studyPlan.completed ? " Completed" : " In Progress"}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>Track your study progress for this plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
              <span className="text-sm text-muted-foreground">
                {studyPlan.topics.filter((t) => t.completed).length} of {studyPlan.topics.length} topics
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {studyPlan.topics.map((topic, index) => (
          <Card key={index} className={topic.completed ? "border-primary/30 bg-primary/5" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Checkbox
                      id={`topic-${index}`}
                      checked={topic.completed}
                      onCheckedChange={(checked) => toggleTopicCompleted(index, checked as boolean)}
                      className="mr-2"
                    />
                    <label htmlFor={`topic-${index}`} className={`${topic.completed ? "line-through opacity-70" : ""}`}>
                      {topic.title}
                    </label>
                  </CardTitle>
                  <CardDescription>Importance: {Math.round(topic.importance * 100)}%</CardDescription>
                </div>
                <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Day {index + 1}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="ml-6 list-disc space-y-2">
                {topic.subtopics.map((subtopic, subIndex) => (
                  <li key={subIndex} className={topic.completed ? "line-through opacity-70" : ""}>
                    {subtopic}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

