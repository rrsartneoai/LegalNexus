"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, CheckCircle, XCircle, ArrowRight, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error"

interface DocumentUploadProps {
  onUploadComplete?: (documentId: string) => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [documentId, setDocumentId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Nieprawidłowy typ pliku",
          description: "Dozwolone są tylko pliki PDF i obrazy (JPG, PNG)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Plik zbyt duży",
          description: "Maksymalny rozmiar pliku to 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      setStatus("idle")
      setProgress(0)
      setErrorMessage("")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
    disabled: status === "uploading" || status === "processing",
  })

  const removeFile = () => {
    setSelectedFile(null)
    setStatus("idle")
    setProgress(0)
    setErrorMessage("")
    setDocumentId(null)
  }

  const uploadDocument = async () => {
    if (!selectedFile) return

    setStatus("uploading")
    setStatusMessage("Przesyłanie pliku...")
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", selectedFile.name)
      formData.append("description", "Dokument przesłany do analizy")

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Błąd podczas przesyłania pliku")
      }

      const result = await response.json()
      setDocumentId(result.documentId)

      // Simulate processing stages
      setStatus("processing")
      setProgress(30)
      setStatusMessage("Weryfikacja pliku...")

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(60)
      setStatusMessage("Ekstrakcja tekstu...")

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProgress(90)
      setStatusMessage("Generowanie analizy AI...")

      await new Promise((resolve) => setTimeout(resolve, 2000))
      setProgress(100)
      setStatus("success")
      setStatusMessage("Analiza zakończona pomyślnie.")

      toast({
        title: "Sukces!",
        description: "Dokument został przesłany i przeanalizowany pomyślnie.",
      })

      if (onUploadComplete && result.documentId) {
        onUploadComplete(result.documentId)
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd")
      setProgress(0)

      toast({
        title: "Błąd",
        description: "Nie udało się przesłać dokumentu. Spróbuj ponownie.",
        variant: "destructive",
      })
    }
  }

  const viewResults = () => {
    if (documentId) {
      window.location.href = `/panel-klienta/dokumenty/${documentId}`
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setStatus("idle")
    setProgress(0)
    setStatusMessage("")
    setErrorMessage("")
    setDocumentId(null)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-900">Analiza Nowego Dokumentu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection Area */}
        {!selectedFile && status === "idle" && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? "Upuść dokument tutaj..." : "Przeciągnij dokument tutaj lub kliknij, aby wybrać plik"}
            </p>
            <p className="text-sm text-gray-500">Obsługiwane formaty: PDF, JPG, PNG (max. 10MB)</p>
          </div>
        )}

        {/* Selected File Display */}
        {selectedFile && status === "idle" && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile} className="text-gray-500 hover:text-red-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && status === "idle" && (
          <Button onClick={uploadDocument} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" size="lg">
            Prześlij do analizy
          </Button>
        )}

        {/* Progress Section */}
        {(status === "uploading" || status === "processing" || status === "success" || status === "error") && (
          <div className="space-y-4">
            {/* Progress Bar */}
            {status !== "error" && (
              <div className="space-y-2">
                <Progress value={progress} className={`h-3 ${status === "success" ? "bg-green-100" : ""}`} />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{statusMessage}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {/* Status Icons and Messages */}
            <div className="flex items-center justify-center space-x-3 py-4">
              {status === "uploading" && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              )}

              {status === "processing" && <div className="animate-pulse rounded-full h-8 w-8 bg-blue-600"></div>}

              {status === "success" && <CheckCircle className="h-12 w-12 text-green-600" />}

              {status === "error" && <XCircle className="h-12 w-12 text-red-600" />}
            </div>

            {/* Success Actions */}
            {status === "success" && (
              <div className="space-y-3">
                <Button onClick={viewResults} className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                  Przejdź do wyników
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={resetUpload} variant="outline" className="w-full bg-transparent">
                  Prześlij kolejny dokument
                </Button>
              </div>
            )}

            {/* Error Message and Retry */}
            {status === "error" && (
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">Wystąpił błąd podczas analizy.</p>
                  {errorMessage && <p className="text-sm text-red-600 mt-1">{errorMessage}</p>}
                </div>
                <Button onClick={resetUpload} variant="outline" className="w-full bg-transparent">
                  Spróbuj ponownie
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
