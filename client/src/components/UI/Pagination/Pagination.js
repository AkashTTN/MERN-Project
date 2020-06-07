import React from 'react'

import './Pagination.css'

const Pagination = React.memo(({ documentsPerPage, totalDocuments, paginate }) => {

    const pageNumbers = []

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
                                className="PageName"
                                onClick={() => paginate(number)}
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