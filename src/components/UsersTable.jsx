

import { useState, useEffect } from "react"
import "./UsersTable.css" 
import { Link } from 'react-router-dom';

export const UsersTable = ({ users, selectedUsers, onSelectionChange }) => {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [searchQuery, setSearchQuery] = useState("")
  const [columnFilters, setColumnFilters] = useState({})
  const [activeFilter, setActiveFilter] = useState(null)

  // Update filtered users when users prop changes
  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...users]

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, value]) => {
      if (value) {
        result = result.filter((user) => {
          const userValue = user[column]
          if (typeof userValue === "string") {
            return userValue.toLowerCase().includes(value.toLowerCase())
          }
          return false
        })
      }
    })

    // Apply global search
    if (searchQuery) {
      result = result.filter((user) => {
        return Object.entries(user).some(([key, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase())
          }
          return false
        })
      })
    }

    setFilteredUsers(result)
  }, [users, searchQuery, columnFilters])

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredUsers.map((user) => user._id))
    }
  }

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      onSelectionChange(selectedUsers.filter((id) => id !== userId))
    } else {
      onSelectionChange([...selectedUsers, userId])
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const handleColumnFilter = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setColumnFilters({})
  }

  const clearColumnFilter = (column) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
  }

  // Get unique values for dropdown filters
  const getUniqueValues = (column) => {
    const values = new Set()
    users.forEach((user) => {
      if (user[column]) {
        values.add(user[column])
      }
    })
    return Array.from(values).sort()
  }

  const toggleFilterDropdown = (column) => {
    setActiveFilter(activeFilter === column ? null : column)
  }

  return (
    <div className="users-table-container">
      {/* Global search and filter controls */}
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-button" onClick={() => setSearchQuery("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="filter-info">
          {Object.keys(columnFilters).length > 0 && (
            <button className="clear-filters-button" onClick={clearAllFilters}>
              Clear filters
            </button>
          )}
          <div className="record-count">
            {filteredUsers.length} of {users.length} row(s)
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {Object.keys(columnFilters).length > 0 && (
        <div className="active-filters">
          {Object.entries(columnFilters).map(([column, value]) => (
            <div key={column} className="filter-tag">
              <span>
                {column}: {value}
              </span>
              <button
                className="remove-filter"
                onClick={() => clearColumnFilter(column)}
                aria-label={`Remove ${column} filter`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length
                    }
                  }}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="image-column">Image</th>
              {[
                { key: "uniqueId", label: "ID" },
                { key: "name", label: "Name" },
                { key: "mobile", label: "Mobile" },
                { key: "email", label: "Email" },
                { key: "city", label: "City", dropdown: true },
                { key: "bloodGroup", label: "Blood Group", dropdown: true },
                { key: "area", label: "Area" },
                { key: "gender", label: "Gender", dropdown: true },
                { key: "dob", label: "DOB" },
                { key: "occupation", label: "Occupation" },
              ].map((column) => (
                <th key={column.key}>
                  <div className="column-header">
                    <span>{column.label}</span>
                    <button
                      className="filter-button"
                      onClick={() => toggleFilterDropdown(column.key)}
                      aria-label={`Filter ${column.label}`}
                    >
                      <span className="filter-icon">🔎</span>
                    </button>
                    {activeFilter === column.key && (
                      <div className="filter-dropdown">
                        {column.dropdown ? (
                          <select
                            value={columnFilters[column.key] || ""}
                            onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                            className="filter-select"
                          >
                            <option value="">All</option>
                            {getUniqueValues(column.key).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={`Filter ${column.label}...`}
                            value={columnFilters[column.key] || ""}
                            onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                            className="filter-input"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={12} className="empty-table">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </td>
                  <td>
                    <div className="user-avatar">
                      <img
                        src={`http://localhost:5000/api/users/images/${localStorage.getItem("token")}/${user.uniqueId}`}
                        alt={user.name}
                        onError={(e) => {
                          ;(e.target).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}&background=random`
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <Link to={`/user/${user.uniqueId}`} className="user-link">
                      {user.uniqueId}
                    </Link>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email}</td>
                  <td>{user.city}</td>
                  <td>{user.bloodGroup}</td>
                  <td>{user.area}</td>
                  <td>{user.gender}</td>
                  <td>{formatDate(user.dob)}</td>
                  <td>{user.occupation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersTable
