import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, Brain } from "lucide-react"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Extract Important Topics from Your Study Materials
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            PeakLearn.ai uses advanced AI to analyze your learning materials and extract the most important topics and
            concepts, so you can focus on what matters.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-card p-6 shadow-md">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Upload Documents</h3>
              <p className="text-center text-muted-foreground">
                Upload your study materials in PDF format. We support textbooks, lecture notes, and research papers.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card p-6 shadow-md">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">AI Analysis</h3>
              <p className="text-center text-muted-foreground">
                Our AI analyzes your documents to identify key topics, concepts, and important information.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card p-6 shadow-md">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Get Results</h3>
              <p className="text-center text-muted-foreground">
                Review a comprehensive list of important topics and create an effective study plan based on AI insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Optimize Your Learning?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Join thousands of students who are studying smarter, not harder, with PeakLearn.ai.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </>
  )
}

