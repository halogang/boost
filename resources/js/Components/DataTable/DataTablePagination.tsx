import React from 'react';

interface DataTablePaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from?: number;
  to?: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: DataTablePaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      } else if (currentPage >= lastPage - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = lastPage - 4; i <= lastPage; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Menampilkan {from ?? 1} - {to ?? total} dari {total} data
      </p>
      <div className="flex gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg text-sm transition ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sebelumnya
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={`px-3 py-2 rounded-lg text-sm transition ${
            currentPage === lastPage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
