"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/back-button"
import { Search, Calendar, User, Eye, MessageCircle, TrendingUp, BookOpen, Scale } from "lucide-react"
import Image from "next/image"

interface BlogSectionProps {
  onBack: () => void
}

export function BlogSection({ onBack }: BlogSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("wszystkie")

  const categories = [
    "wszystkie",
    "prawo-cywilne",
    "prawo-pracy",
    "prawo-administracyjne",
    "technologie-prawne",
    "orzecznictwo",
  ]

  const featuredPost = {
    id: 1,
    title: "Sztuczna Inteligencja w Prawie - Rewolucja czy Ewolucja?",
    excerpt:
      "Analiza wpływu technologii AI na praktykę prawniczą w Polsce. Jak nowe narzędzia zmieniają sposób pracy prawników i czy zastąpią tradycyjne metody?",
    author: "Dr hab. Anna Kowalska",
    date: "2024-01-15",
    readTime: "8 min",
    views: 2847,
    comments: 23,
    category: "technologie-prawne",
    image: "/images/digital-gavel.png",
    featured: true,
  }

  const blogPosts = [
    {
      id: 2,
      title: "Nowe przepisy RODO 2024 - Co się zmienia?",
      excerpt: "Przegląd najważniejszych zmian w przepisach o ochronie danych osobowych wprowadzonych w 2024 roku.",
      author: "Mec. Piotr Nowak",
      date: "2024-01-12",
      readTime: "6 min",
      views: 1923,
      comments: 15,
      category: "prawo-administracyjne",
      image: "/images/legal-tech-symbol.png",
    },
    {
      id: 3,
      title: "Kodeks Pracy po nowelizacji - Praktyczne wskazówki",
      excerpt: "Jak nowe przepisy Kodeksu Pracy wpływają na codzienną praktykę HR i relacje pracodawca-pracownik.",
      author: "Mec. Maria Wiśniewska",
      date: "2024-01-10",
      readTime: "5 min",
      views: 1654,
      comments: 12,
      category: "prawo-pracy",
      image: "/images/ai-justice.png",
    },
    {
      id: 4,
      title: "Precedensowe orzeczenie SN w sprawie umów najmu",
      excerpt: "Analiza najnowszego orzeczenia Sądu Najwyższego dotyczącego praw najemców i obowiązków wynajmujących.",
      author: "Prof. dr hab. Jan Kowalski",
      date: "2024-01-08",
      readTime: "7 min",
      views: 2156,
      comments: 18,
      category: "orzecznictwo",
      image: "/images/digital-justice.png",
    },
    {
      id: 5,
      title: "Digitalizacja kancelarii prawnych - Przewodnik 2024",
      excerpt: "Kompletny przewodnik po narzędziach i procesach cyfryzacji dla nowoczesnych kancelarii prawnych.",
      author: "Mec. Tomasz Zieliński",
      date: "2024-01-05",
      readTime: "10 min",
      views: 3241,
      comments: 27,
      category: "technologie-prawne",
      image: "/images/brain-ai.png",
    },
    {
      id: 6,
      title: "Umowy cywilnoprawne vs umowy o pracę - Różnice prawne",
      excerpt: "Szczegółowe porównanie różnych form zatrudnienia i ich konsekwencji prawnych dla stron umowy.",
      author: "Mec. Katarzyna Lewandowska",
      date: "2024-01-03",
      readTime: "6 min",
      views: 1876,
      comments: 14,
      category: "prawo-cywilne",
      image: "/images/ai-knowledge.png",
    },
  ]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "wszystkie" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      wszystkie: "Wszystkie",
      "prawo-cywilne": "Prawo Cywilne",
      "prawo-pracy": "Prawo Pracy",
      "prawo-administracyjne": "Prawo Administracyjne",
      "technologie-prawne": "Technologie Prawne",
      orzecznictwo: "Orzecznictwo",
    }
    return categoryNames[category] || category
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
                <Image src="/images/legal-tech-symbol.png" alt="Legal Tech" fill className="object-contain" />
              </div>
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog Prawny</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Najnowsze informacje ze świata prawa, analizy przepisów i komentarze ekspertów
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj artykułów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {getCategoryName(category)}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-500">Wyróżniony</Badge>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{getCategoryName(featuredPost.category)}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Popularne
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{featuredPost.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {featuredPost.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {featuredPost.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {getCategoryName(post.category)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.readTime} czytania</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Brak artykułów</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nie znaleziono artykułów spełniających kryteria wyszukiwania.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
