"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, BookOpen, List, BarChart2, Loader2 } from "lucide-react"
import Link from "next/link"

type Document = {
  _id: string
  filename: string
  subject: string
  topics: Array<{
    title: string
    subtopics: string[]
    importance: number
  }>
}

export default function DocumentPage() {
  const { id } = useParams()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await apiClient.get(`/api/documents/${id}`)
        setDocument(response.data.document)
      } catch (err: any) {
        setError("Failed to fetch document analysis")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [id])

  const downloadDocument = async () => {
    if (!document) return

    try {
      const response = await apiClient.get(`/api/documents/${id}/download`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", document.filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError("Failed to download document")
    }
  }

  if (loading) {
    return (
      <div className="container flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>{error || "Document not found"}</AlertDescription>
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{document.filename}</h1>
          <p className="text-muted-foreground">Subject: {document.subject}</p>
        </div>
        <Button onClick={downloadDocument}>
          <Download className="mr-2 h-4 w-4" />
          Download Original
        </Button>
      </div>

      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="topics">
            <List className="mr-2 h-4 w-4" />
            Topics List
          </TabsTrigger>
          <TabsTrigger value="importance">
            <BarChart2 className="mr-2 h-4 w-4" />
            By Importance
          </TabsTrigger>
          <TabsTrigger value="study-plan">
            <BookOpen className="mr-2 h-4 w-4" />
            Study Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <CardTitle>Topics Analysis</CardTitle>
              <CardDescription>All important topics extracted from your document</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {document.topics.map((topic, index) => (
                  <AccordionItem key={index} value={`topic-${index}`}>
                    <AccordionTrigger>{topic.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="ml-6 list-disc space-y-2">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <li key={subIndex}>{subtopic}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importance">
          <Card>
            <CardHeader>
              <CardTitle>Topics by Importance</CardTitle>
              <CardDescription>Topics ranked by their importance in the document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...document.topics]
                  .sort((a, b) => b.importance - a.importance)
                  .map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{topic.title}</h3>
                        <div className="flex items-center">
                          <div className="h-2 w-24 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${topic.importance * 100}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm">{Math.round(topic.importance * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study-plan">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Study Plan</CardTitle>
              <CardDescription>Based on topic importance and your selected hours per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[...document.topics]
                  .sort((a, b) => b.importance - a.importance)
                  .map((topic, index) => (
                    <div key={index} className="border-b pb-6 last:border-0">
                      <h3 className="mb-2 text-lg font-medium">
                        Day {index + 1}: {topic.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Focus on understanding the core concepts and their applications
                      </p>
                      <ul className="ml-6 list-disc space-y-2">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <li key={subIndex}>{subtopic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

