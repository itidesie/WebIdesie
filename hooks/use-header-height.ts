"use client"

import { useEffect, useState } from "react"

export function useHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const topNav = document.getElementById("top-nav-bar")
      const mainNav = document.getElementById("main-nav-bar")

      if (topNav && mainNav) {
        const topNavHeight = topNav.getBoundingClientRect().height
        const mainNavHeight = mainNav.getBoundingClientRect().height
        const totalHeight = topNavHeight + mainNavHeight
        setHeaderHeight(totalHeight)
      } else if (topNav) {
        // Fallback if main nav isn't found (mobile)
        const topNavHeight = topNav.getBoundingClientRect().height
        setHeaderHeight(topNavHeight)
      } else {
        setHeaderHeight(140)
      }
    }

    // Calculate on mount with multiple attempts
    calculateHeaderHeight()

    // Try again after a short delay to ensure DOM is ready
    const timeoutId1 = setTimeout(calculateHeaderHeight, 100)
    const timeoutId2 = setTimeout(calculateHeaderHeight, 300)

    // Recalculate on resize
    window.addEventListener("resize", calculateHeaderHeight)

    // Recalculate on scroll (for dynamic header changes)
    window.addEventListener("scroll", calculateHeaderHeight)

    return () => {
      window.removeEventListener("resize", calculateHeaderHeight)
      window.removeEventListener("scroll", calculateHeaderHeight)
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
    }
  }, [])

  return headerHeight
}
