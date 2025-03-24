"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/providers/auth-provider"
import { FileUploader } from "@/components/file-uploader"
import { StudyPlanList } from "@/components/study-plan-list"
import { RecentDocuments } from "@/components/recent-documents"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Welcome, {user?.name}</h1>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="study-plans">Study Plans</TabsTrigger>
          <TabsTrigger value="documents">Recent Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload a PDF file to extract important topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Study Plans</CardTitle>
              <CardDescription>Manage your active study plans</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyPlanList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>View your recently analyzed documents</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentDocuments />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

