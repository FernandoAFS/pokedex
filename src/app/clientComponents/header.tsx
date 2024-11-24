
'use client'

import { useState } from 'react'
import { HeaderLayout, BackButton, HomeButton, SearchInput } from "@/components/header";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

const DEBOUNCE_DELAY = 500 // half a second

export const StatefulHeader = () => {
  /**
   * Component that injects nav with context state
   */
  const [searchItem, setSearchItem] = useState<string | null>(null)
  const router = useRouter()
  const debounceRedirect = useDebouncedCallback((searchItem: string) => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search))
    const newParams = new URLSearchParams({
      ...params,
      search: searchItem,
    })
    router.replace(`/?${newParams}`)
  }, DEBOUNCE_DELAY)

  return (
    <HeaderLayout
      leftButton={
        <Link href={`/`}>
          <BackButton />
        </Link>
      }
      rightButton={
        <Link href='/'>
          <HomeButton />
        </Link>
      }
    />
  )
}
