"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogIn, LogOut, FileText, Scale, Info, Home, BookOpen, Shield, Gavel } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void
  showMenuButton?: boolean
  onNavigate?: (section: string) => void
  currentSection?: string
}

export function Header({ onMenuToggle, showMenuButton = false, onNavigate, currentSection }: HeaderProps) {
  const { user, isAuthenticated, signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Strona Główna", key: "home", icon: Home },
    { name: "Asystent AI", key: "asystent-ai", icon: FileText },
    { name: "Blog", key: "blog", icon: BookOpen },
    { name: "Poradniki", key: "poradniki", icon: BookOpen },
  ]

  const servicesDropdown = [
    { name: "Analiza dokumentów", href: "/analiza-dokumentow", icon: FileText },
    { name: "Pisma prawne", href: "/pisma-prawne", icon: Scale },
    { name: "Konsultacje", href: "/konsultacje", icon: Gavel },
    { name: "Reprezentacja", href: "/reprezentacja", icon: Gavel },
  ]

  const informationDropdown = [
    { name: "Regulamin", href: "/regulamin", icon: BookOpen },
    { name: "Polityka prywatności", href: "/polityka-prywatnosci", icon: Shield },
    { name: "RODO", href: "/rodo", icon: Shield },
    { name: "FAQ", href: "/faq", icon: Info },
  ]

  const companyDropdown = [{ name: "Jak to działa", href: "/jak-to-dziala", icon: Info }]

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/"
  }

  const getUserPanelLink = () => {
    if (!user) return "/panel-klienta"

    switch (user.role) {
      case "admin":
        return "/admin"
      case "operator":
        return "/panel-operatora"
      default:
        return "/panel-klienta"
    }
  }

  const handleNavClick = (item: any) => {
    if (item.href) {
      window.location.href = item.href
    } else if (onNavigate) {
      onNavigate(item.key)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-700 dark:text-blue-400">
          <Scale className="h-6 w-6" />
          LegalNexus
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => handleNavClick(item)}
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentSection === item.key ? "text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {item.name}
            </Button>
          ))}

          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Usługi
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {servicesDropdown.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Information Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Informacje
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {informationDropdown.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Company Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Firma
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {companyDropdown.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Auth/User Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.role === "client" ? "Klient" : user.role === "operator" ? "Operator" : "Administrator"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getUserPanelLink()}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mój panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/logowanie">
                  <LogIn className="mr-2 h-4 w-4" />
                  Logowanie
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/rejestracja">
                  <User className="mr-2 h-4 w-4" />
                  Rejestracja
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Navigation Toggle */}
          {showMenuButton && (
            <Sheet onOpenChange={onMenuToggle}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
                <div className="flex flex-col gap-4 p-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      onClick={() => handleNavClick(item)}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 justify-start"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Usługi</h3>
                    {servicesDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 text-base py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Informacje</h3>
                    {informationDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 text-base py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Firma</h3>
                    {companyDropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 text-base py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
