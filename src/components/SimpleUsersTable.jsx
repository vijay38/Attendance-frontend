import { useState, useEffect } from "react"
import "./SimpleUsersTable.css"


export const SimpleUsersTable = ({ users, selectedUsers, onSelectionChange }) => {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [searchQuery, setSearchQuery] = useState("")

  // Update filtered users when users prop or search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter((user) => {
      return Object.entries(user).some(([key, value]) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(query)
        }
        return false
      })
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery])

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

  return (
    <div className="simple-users-table-container">
      {/* Global search */}
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users by any field..."
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

        <div className="record-count">
          {filteredUsers.length} of {users.length} row(s)
        </div>
      </div>

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
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>City</th>
              <th>Blood Group</th>
              <th>Area</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Occupation</th>
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
                        src={`https://api.emmanuelministrieshyd.com/api/users/images/${localStorage.getItem("token")}/${user.uniqueId}`}
                        alt={user.name}
                        onError={(e) => {
                          ;(e.target).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}&background=random`
                        }}
                      />
                    </div>
                  </td>
                  <td>{user.uniqueId}</td>
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

export default SimpleUsersTable
