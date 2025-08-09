"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Scale, Menu, X, User } from "lucide-react"
import { useAuth } from "@/lib/auth"
import Link from "next/link"
import type { Locale } from "@/lib/i18n"

interface NavigationProps {
  t: any
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

export function Navigation({ t, locale, onLocaleChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const navItems = [
    { href: "/asystent-ai", label: t.nav.aiAssistant },
    // Commented out sections as requested
    // { href: "/funkcje", label: t.nav.features },
    // { href: "/dokumentacja-api", label: t.nav.apiDemo },
    // { href: "/cennik", label: "Cennik" },
    // { href: "/kancelarie", label: "Kancelarie" },
    // { href: "/o-nas", label: "O nas" },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Scale className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">
                LegalAPI<span className="text-blue-600">Nexus</span>
              </span>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />

            {isAuthenticated && user ? (
              <Link href="/panel-klienta">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link href="/logowanie">
                  <Button variant="outline">Zaloguj się</Button>
                </Link>
                <Link href="/rejestracja">
                  <Button>{t.nav.getStarted}</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pl-3 space-y-2">
              <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />

              {isAuthenticated && user ? (
                <Link href="/panel-klienta">
                  <Button variant="outline" className="w-full bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link href="/logowanie">
                    <Button variant="outline" className="w-full bg-transparent">
                      Zaloguj się
                    </Button>
                  </Link>
                  <Link href="/rejestracja">
                    <Button className="w-full">{t.nav.getStarted}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
