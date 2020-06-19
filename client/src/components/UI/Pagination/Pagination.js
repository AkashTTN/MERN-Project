import React, { useState } from 'react'

import './Pagination.css'

const Pagination = React.memo(({ documentsPerPage, totalDocuments, paginate }) => {

    const pageNumbers = []
    const [currentPageNumber, setCurrentPageNumber] = useState(1)

    for (let i = 1; i <= Math.ceil(totalDocuments / documentsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <div className="PaginationContainer flex-container">
            <ul className="Pagination flex-container">
                {
                    pageNumbers.map((number) => (
                        <li key={number} className="PageItem">
                            <a
                                className={
                                    currentPageNumber === number 
                                    ? 'PageName active'
                                    : 'PageName'
                                }
                                onClick={() => {
                                    setCurrentPageNumber(number)
                                    paginate(number)
                                }}
                            >
                                {number}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
})

export default Pagination