import React, { useState } from 'react';
import '../styles/pagination.css';

function Pagination({ totalPages, currentPage, onPageChange }) {
    const [pageGroup, setPageGroup] = useState(0);
    const maxPagesToShow = 4;

    const startPage = pageGroup * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const handleNextGroup = () => {
        if (endPage < totalPages) {
            setPageGroup(pageGroup + 1);
        }
    };

    const handlePreviousGroup = () => {
        if (startPage > 1) {
            setPageGroup(pageGroup - 1);
        }
    };

    return (
        <div className="pagination-container">
            <div className="pagination">
                <button 
                    className="arrow"
                    onClick={handlePreviousGroup}
                    disabled={startPage === 1}
                >
                    &lt;
                </button>
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                    <button
                        key={startPage + i}
                        onClick={() => onPageChange(startPage + i)}
                        disabled={startPage + i === currentPage}
                    >
                        {startPage + i}
                    </button>
                ))}
                <button 
                    className="arrow"
                    onClick={handleNextGroup}
                    disabled={endPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default Pagination;
