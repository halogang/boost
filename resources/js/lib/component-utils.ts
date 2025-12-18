/**
 * COMPONENT UTILITIES
 * Helper functions for common component patterns
 */

// ============================================
// TABLE UTILITIES
// ============================================

/**
 * Generate pagination info text
 * @param currentPage - Current page number
 * @param perPage - Items per page
 * @param total - Total items
 * @returns Pagination info string
 */
export function getPaginationInfo(
  currentPage: number,
  perPage: number,
  total: number
): string {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, total)
  return `Menampilkan ${start} - ${end} dari ${total} data`
}

/**
 * Calculate total pages
 * @param total - Total items
 * @param perPage - Items per page
 * @returns Total pages
 */
export function getTotalPages(total: number, perPage: number): number {
  return Math.ceil(total / perPage)
}

/**
 * Generate page numbers for pagination
 * @param currentPage - Current page
 * @param totalPages - Total pages
 * @param maxVisible - Maximum visible page numbers
 * @returns Array of page numbers (with null for ellipsis)
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | null)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const halfVisible = Math.floor(maxVisible / 2)
  let start = currentPage - halfVisible
  let end = currentPage + halfVisible

  if (start <= 1) {
    start = 1
    end = maxVisible
  } else if (end >= totalPages) {
    start = totalPages - maxVisible + 1
    end = totalPages
  }

  const pages: (number | null)[] = []
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push(null) // Ellipsis
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push(null) // Ellipsis
    pages.push(totalPages)
  }

  return pages
}

/**
 * Sort table data by column
 * @param data - Array of data
 * @param column - Column key
 * @param direction - Sort direction
 * @returns Sorted data
 */
export function sortTableData<T extends Record<string, any>>(
  data: T[],
  column: keyof T,
  direction: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[column]
    const bVal = b[column]

    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// ============================================
// FORM UTILITIES
// ============================================

/**
 * Get validation error message
 * @param errors - Inertia errors object
 * @param field - Field name
 * @returns Error message or undefined
 */
export function getError(
  errors: Record<string, string>,
  field: string
): string | undefined {
  return errors[field]
}

/**
 * Check if field has error
 * @param errors - Inertia errors object
 * @param field - Field name
 * @returns True if has error
 */
export function hasError(
  errors: Record<string, string>,
  field: string
): boolean {
  return !!errors[field]
}

/**
 * Get input class with error state
 * @param baseClass - Base CSS class
 * @param hasError - Whether field has error
 * @returns Class string
 */
export function getInputClass(baseClass: string, hasError: boolean): string {
  return hasError
    ? `${baseClass} border-destructive focus-visible:ring-destructive`
    : baseClass
}

// ============================================
// STATUS UTILITIES
// ============================================

export type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default'

/**
 * Get status badge variant
 * @param status - Status string
 * @returns Badge variant
 */
export function getStatusVariant(status: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    'active': 'success',
    'aktif': 'success',
    'completed': 'success',
    'selesai': 'success',
    'approved': 'success',
    'paid': 'success',
    'lunas': 'success',
    
    'pending': 'warning',
    'menunggu': 'warning',
    'processing': 'warning',
    'proses': 'warning',
    
    'inactive': 'danger',
    'nonaktif': 'danger',
    'rejected': 'danger',
    'ditolak': 'danger',
    'cancelled': 'danger',
    'dibatalkan': 'danger',
    'failed': 'danger',
    'gagal': 'danger',
    
    'draft': 'default',
    'new': 'info',
    'baru': 'info',
  }

  return statusMap[status.toLowerCase()] || 'default'
}

/**
 * Get status color classes
 * @param variant - Status variant
 * @returns Tailwind color classes
 */
export function getStatusColor(variant: StatusType): string {
  const colorMap: Record<StatusType, string> = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-destructive/10 text-destructive border-destructive/20',
    info: 'bg-info/10 text-info border-info/20',
    default: 'bg-muted text-muted-foreground border-border',
  }

  return colorMap[variant]
}

// ============================================
// FILTER UTILITIES
// ============================================

/**
 * Filter array by search query
 * @param data - Array to filter
 * @param query - Search query
 * @param fields - Fields to search in
 * @returns Filtered array
 */
export function filterBySearch<T extends Record<string, any>>(
  data: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query) return data

  const lowerQuery = query.toLowerCase()
  
  return data.filter(item =>
    fields.some(field => {
      const value = item[field]
      return value && String(value).toLowerCase().includes(lowerQuery)
    })
  )
}

/**
 * Build query params from filters
 * @param filters - Filter object
 * @returns Query params object
 */
export function buildQueryParams(
  filters: Record<string, any>
): Record<string, string> {
  const params: Record<string, string> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params[key] = String(value)
    }
  })
  
  return params
}

// ============================================
// ROUTE UTILITIES
// ============================================

/**
 * Build route with query params
 * @param route - Base route
 * @param params - Query params
 * @returns Full route with params
 */
export function buildRoute(
  route: string,
  params?: Record<string, any>
): string {
  if (!params || Object.keys(params).length === 0) {
    return route
  }

  const queryParams = buildQueryParams(params)
  const queryString = new URLSearchParams(queryParams).toString()
  
  return `${route}?${queryString}`
}

// ============================================
// EXPORT UTILITIES
// ============================================

/**
 * Export table data to CSV
 * @param data - Array of data
 * @param filename - File name
 * @param columns - Column definitions
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  const headers = columns.map(col => col.label).join(',')
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.key]
      // Escape commas and quotes
      const escaped = String(value || '').replace(/"/g, '""')
      return `"${escaped}"`
    }).join(',')
  )

  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Print table data
 * @param title - Print title
 * @param content - HTML content to print
 */
export function printTable(title: string, content: string): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
          }
          h1 { 
            font-size: 24px; 
            margin-bottom: 20px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #f2f2f2;
            font-weight: bold;
          }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
