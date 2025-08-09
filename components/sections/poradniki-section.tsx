"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/back-button"
import { Search, Download, Eye, Star, Clock, FileText, Scale, Users } from "lucide-react"
import Image from "next/image"

interface PoradnikiSectionProps {
  onBack: () => void
}

export function PoradnikiSection({ onBack }: PoradnikiSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("wszystkie")
  const [selectedDifficulty, setSelectedDifficulty] = useState("wszystkie")

  const categories = [
    "wszystkie",
    "prawo-cywilne",
    "prawo-pracy",
    "prawo-administracyjne",
    "prawo-karne",
    "prawo-gospodarcze",
  ]

  const difficulties = ["wszystkie", "łatwy", "średni", "trudny"]

  const featuredGuides = [
    {
      id: 1,
      title: "Kompletny przewodnik po zakładaniu spółki z o.o.",
      description:
        "Szczegółowy przewodnik krok po kroku przez proces rejestracji spółki z ograniczoną odpowiedzialnością",
      category: "prawo-gospodarcze",
      difficulty: "średni",
      downloads: 5420,
      views: 12340,
      rating: 4.8,
      estimatedTime: "45 min",
      image: "/images/legal-tech-symbol.png",
      featured: true,
    },
    {
      id: 2,
      title: "Jak napisać pozew do sądu - wzór i instrukcja",
      description: "Praktyczny poradnik z wzorami pism procesowych i instrukcjami wypełniania",
      category: "prawo-cywilne",
      difficulty: "średni",
      downloads: 3890,
      views: 8760,
      rating: 4.6,
      estimatedTime: "30 min",
      image: "/images/digital-justice.png",
      featured: true,
    },
  ]

  const guides = [
    {
      id: 3,
      title: "Rozwiązanie umowy o pracę - procedury i wzory",
      description: "Wszystko co musisz wiedzieć o wypowiadaniu umów o pracę",
      category: "prawo-pracy",
      difficulty: "łatwy",
      downloads: 2340,
      views: 5670,
      rating: 4.5,
      estimatedTime: "20 min",
      image: "/images/ai-justice.png",
    },
    {
      id: 4,
      title: "Odwołanie od decyzji administracyjnej - wzór",
      description: "Jak skutecznie odwołać się od decyzji organu administracyjnego",
      category: "prawo-administracyjne",
      difficulty: "średni",
      downloads: 1890,
      views: 4320,
      rating: 4.3,
      estimatedTime: "25 min",
      image: "/images/brain-ai.png",
    },
    {
      id: 5,
      title: "Umowa najmu mieszkania - co sprawdzić przed podpisaniem",
      description: "Lista kontrolna i najważniejsze klauzule w umowie najmu",
      category: "prawo-cywilne",
      difficulty: "łatwy",
      downloads: 4560,
      views: 9870,
      rating: 4.7,
      estimatedTime: "15 min",
      image: "/images/ai-knowledge.png",
    },
    {
      id: 6,
      title: "Procedura karna - prawa podejrzanego",
      description: "Kompendium praw osoby podejrzanej w postępowaniu karnym",
      category: "prawo-karne",
      difficulty: "trudny",
      downloads: 1230,
      views: 2890,
      rating: 4.4,
      estimatedTime: "60 min",
      image: "/images/digital-gavel.png",
    },
  ]

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "wszystkie" || guide.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "wszystkie" || guide.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getCategoryName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      wszystkie: "Wszystkie",
      "prawo-cywilne": "Prawo Cywilne",
      "prawo-pracy": "Prawo Pracy",
      "prawo-administracyjne": "Prawo Administracyjne",
      "prawo-karne": "Prawo Karne",
      "prawo-gospodarcze": "Prawo Gospodarcze",
    }
    return categoryNames[category] || category
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "łatwy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "średni":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "trudny":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <BackButton onClick={onBack} />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <Image src="/images/ai-knowledge.png" alt="Knowledge Base" fill className="object-contain" />
              </div>
              <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Poradniki Prawne</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Praktyczne przewodniki i wzory dokumentów prawnych do pobrania
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Szukaj poradników..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {getCategoryName(category)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 py-2">Poziom trudności:</span>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="capitalize"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Guides */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Wyróżnione poradniki</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image src={guide.image || "/placeholder.svg"} alt={guide.title} fill className="object-cover" />
                    <Badge className="absolute top-3 left-3 bg-orange-500">Wyróżniony</Badge>
                    <Badge className={`absolute top-3 right-3 ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{getCategoryName(guide.category)}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{guide.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.estimatedTime}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {guide.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {guide.downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Pobierz poradnik
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Guides */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Wszystkie poradniki</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <Image src={guide.image || "/placeholder.svg"} alt={guide.title} fill className="object-cover" />
                    <Badge className={`absolute top-3 right-3 ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryName(guide.category)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{guide.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-base line-clamp-2">{guide.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.estimatedTime}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {guide.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {guide.downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Pobierz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Brak poradników</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nie znaleziono poradników spełniających kryteria wyszukiwania.
              </p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">15,000+</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Aktywnych użytkowników</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Download className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50,000+</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pobranych poradników</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Scale className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">200+</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Dostępnych wzorów</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
