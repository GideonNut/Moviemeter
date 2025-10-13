import { useState, useEffect, useCallback, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number, limit: number) => Promise<T[]>
  limit?: number
  initialPage?: number
  enabled?: boolean
}

interface UseInfiniteScrollReturn<T> {
  data: T[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refetch: () => void
  infiniteRef: (node?: Element | null) => void
  inView: boolean
}

export function useInfiniteScroll<T>({
  fetchData,
  limit = 20,
  initialPage = 1,
  enabled = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(initialPage)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { ref: infiniteRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  const loadData = useCallback(async (pageNumber: number, isLoadMore = false) => {
    if (!enabled) return

    try {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const newData = await fetchData(pageNumber, limit)
      
      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      if (isLoadMore) {
        setData(prev => [...prev, ...newData])
      } else {
        setData(newData)
      }

      setPage(pageNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setHasMore(false)
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [fetchData, limit, enabled])

  const loadMore = useCallback(() => {
    if (!loading && !isLoadingMore && hasMore && enabled) {
      loadData(page + 1, true)
    }
  }, [loading, isLoadingMore, hasMore, enabled, page, loadData])

  const refetch = useCallback(() => {
    setPage(initialPage)
    setData([])
    setHasMore(true)
    setError(null)
    loadData(initialPage, false)
  }, [initialPage, loadData])

  // Load initial data
  useEffect(() => {
    if (enabled && data.length === 0) {
      loadData(initialPage, false)
    }
  }, [enabled, data.length, initialPage, loadData])

  // Load more when in view
  useEffect(() => {
    if (inView && hasMore && !loading && !isLoadingMore) {
      loadMore()
    }
  }, [inView, hasMore, loading, isLoadingMore, loadMore])

  return {
    data,
    loading: loading && !isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    infiniteRef,
    inView,
  }
}
