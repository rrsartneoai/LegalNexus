"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DocumentUpload } from "@/components/document-upload"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  name: string
  status: "uploaded" | "processing" | "completed" | "error"
  created_at: string
  file_size?: number
  analysis?: {
    summary: string
    key_points: string[]
  }
}

export default function PanelKlientaPage() {
  const { user, isAuthenticated } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/logowanie")
      return
    }

    fetchDocuments()
  }, [isAuthenticated, router])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/cases")
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.cases || [])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    const statusConfig = {
      uploaded: { label: "Przesłano", color: "bg-blue-100 text-blue-800", icon: Clock },
      processing: { label: "Przetwarzanie", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      completed: { label: "Zakończono", color: "bg-green-100 text-green-800", icon: CheckCircle },
      error: { label: "Błąd", color: "bg-red-100 text-red-800", icon: AlertCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A"
    return (bytes / 1024 / 1024).toFixed(2) + " MB"
  }

  const handleUploadComplete = (documentId: string) => {
    setShowUpload(false)
    fetchDocuments()
  }

  if (!isAuthenticated) {
    return <div className="p-10 text-center">Przekierowywanie...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Powrót
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Panel Klienta</h1>
                <p className="text-gray-600">Witaj, {user?.name}</p>
              </div>
            </div>

            <Button onClick={() => setShowUpload(!showUpload)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              {showUpload ? "Anuluj" : "Nowy dokument"}
            </Button>
          </div>

          {/* Upload Section */}
          {showUpload && (
            <div className="mb-8">
              <DocumentUpload onUploadComplete={handleUploadComplete} />
            </div>
          )}

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Moje Dokumenty
              </CardTitle>
              <CardDescription>Lista przesłanych dokumentów i ich status analizy</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Ładowanie dokumentów...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Brak dokumentów</h3>
                  <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych przesłanych dokumentów.</p>
                  <Button onClick={() => setShowUpload(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Prześlij pierwszy dokument
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{new Date(doc.created_at).toLocaleDateString("pl-PL")}</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {getStatusBadge(doc.status)}
                        {doc.status === "completed" && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/panel-klienta/dokumenty/${doc.id}`}>Zobacz wyniki</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Wszystkie dokumenty</p>
                    <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">W trakcie analizy</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {documents.filter((d) => d.status === "processing").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Zakończone</p>
                    <p className="text-2xl font-bold text-green-600">
                      {documents.filter((d) => d.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
