import React from 'react'

import './Filter.css'

const Filter = ({ filter, filterTypes, onChangeHandler }) => {
    return (
        <span className="Filter">
            <i className="fas fa-filter"></i>
            <select
                value={filter}
                onChange={(e) => onChangeHandler(e.target.value)}
                name="complaintStatusFilter"
                className="FilterTypes"
            >
                <option value='' disabled hidden >Filter</option>
                <option value='None' >None</option>
                {
                    filterTypes
                        ? filterTypes.map((type) => {
                            return (
                                <option
                                    key={type}
                                    value={type}>
                                    {type}
                                </option>
                            )
                        })
                        : null
                }
            </select>
        </span>
    )
}

export default Filter
