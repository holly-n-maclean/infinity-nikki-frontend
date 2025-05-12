import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        style={buttonStyle(currentPage === 1)}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, i) =>
        page === '...' ? (
          <span key={i} style={{ padding: '0.4rem 0.8rem', color: '#888' }}>…</span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            style={buttonStyle(page === currentPage)}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={buttonStyle(currentPage === totalPages)}
      >
        Next →
      </button>
    </div>
  );
}

const buttonStyle = (isActiveOrDisabled) => ({
  padding: '0.4rem 0.8rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: isActiveOrDisabled ? '#bf98cf' : '#fff',
  color: isActiveOrDisabled ? '#fff' : '#333',
  cursor: isActiveOrDisabled ? 'default' : 'pointer',
  pointerEvents: isActiveOrDisabled ? 'none' : 'auto',
});

export default Pagination;