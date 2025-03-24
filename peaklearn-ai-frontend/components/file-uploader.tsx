"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { AlertCircle, File, Upload, Loader2 } from "lucide-react"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [subject, setSubject] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState(2)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError("")
    } else {
      setFile(null)
      setError("Please select a valid PDF file")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    if (!subject.trim()) {
      setError("Please enter a subject")
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 500)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("subject", subject)
      formData.append("hoursPerDay", hoursPerDay.toString())

      const response = await apiClient.post("/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      clearInterval(progressInterval)
      setProgress(100)

      // Redirect to document analysis page
      setTimeout(() => {
        router.push(`/document/${response.data.documentId}`)
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to upload file. Please try again.")
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setError("")
    } else {
      setError("Please drop a valid PDF file")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 p-12 text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center space-y-2">
            <File className="h-8 w-8 text-primary" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">Drag and drop your PDF file</h3>
            <p className="text-sm text-muted-foreground">or click the button below to browse files</p>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="e.g., Mathematics, Biology, History"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Hours Per Day to Study</Label>
        <Input
          id="hours"
          type="number"
          min="1"
          max="12"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(Number.parseInt(e.target.value))}
          required
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Uploading...</span>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={uploading || !file}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload and Analyze"
        )}
      </Button>
    </form>
  )
}

