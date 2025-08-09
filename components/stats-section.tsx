"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, FileText, Clock, Star, Shield, Zap, Award } from "lucide-react"

export function StatsSection() {
  const mainStats = [
    {
      icon: Users,
      value: "500+",
      label: "Aktywnych kancelarii",
      description: "Kancelarie prawne korzystające z naszej platformy",
      trend: "+25%",
      color: "blue",
    },
    {
      icon: FileText,
      value: "50,000+",
      label: "Przeanalizowanych dokumentów",
      description: "Dokumenty prawne przeanalizowane przez AI",
      trend: "+40%",
      color: "green",
    },
    {
      icon: Clock,
      value: "4h",
      label: "Średnia oszczędność czasu",
      description: "Dziennie na jednego prawnika",
      trend: "+15%",
      color: "purple",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Ocena użytkowników",
      description: "Średnia ocena platformy",
      trend: "Stała",
      color: "yellow",
    },
  ]

  const additionalStats = [
    { icon: Shield, label: "99.9% Uptime", value: "Niezawodność" },
    { icon: Zap, label: "< 2s", value: "Czas odpowiedzi AI" },
    { icon: Award, label: "ISO 27001", value: "Certyfikat bezpieczeństwa" },
    { icon: TrendingUp, label: "300%", value: "Wzrost efektywności" },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Statystyki Platformy
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Liczby mówią same za siebie
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Zobacz jak nasza platforma AI rewolucjonizuje pracę kancelarii prawnych w całej Polsce
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mainStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900 group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-300">{stat.label}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</p>
                </div>

                {/* Decorative element */}
                <div
                  className={`absolute -bottom-2 -right-2 w-16 h-16 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full opacity-20 group-hover:scale-125 transition-transform`}
                ></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {additionalStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <stat.icon className="h-6 w-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Dane aktualizowane w czasie rzeczywistym</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
          </p>
        </div>
      </div>
    </section>
  )
}
