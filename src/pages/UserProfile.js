 "use client"

import { useState, useEffect } from "react"
import "./UserProfile.css"
import { useParams } from 'react-router-dom';
const UserProfile = () => {
    
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
    const { userId } = useParams();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token');
        // Replace with your actual API endpoint
        const response = await fetch(`http://api.emmanuelministrieshyd.com/api/users/user/${userId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    userId:userId
                }
            })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user profile...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>
  }

  if (!user) {
    return <div className="error-message">User not found</div>
  }

  return (
    <div className="user-profile-container">
      <div className="panels-container">
        {/* Panel 1: User Details */}
        <div className="panel user-details-panel">
          <div className="profile-header">
            <div className="user-avatar">
              <img
                src={`http://api.emmanuelministrieshyd.com/api/users/images/${localStorage.getItem("token")}/${user.uniqueId}`}
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                }}
              />
            </div>
            <h2>{user.name}</h2>
          </div>

          <div className="user-info">
            <div className="info-item">
              <span className="label">Mobile:</span>
              <span className="value">{user.mobile}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">City:</span>
              <span className="value">{user.city}</span>
            </div>
            <div className="info-item">
              <span className="label">Area:</span>
              <span className="value">{user.area}</span>
            </div>
            <div className="info-item">
              <span className="label">Blood Group:</span>
              <span className="value">{user.bloodGroup}</span>
            </div>
            <div className="info-item">
              <span className="label">Gender:</span>
              <span className="value">{user.gender}</span>
            </div>
            {user.dob && (
              <div className="info-item">
                <span className="label">Date of Birth:</span>
                <span className="value">{user.dob}</span>
              </div>
            )}
            <div className="info-item">
              <span className="label">Occupation:</span>
              <span className="value">{user.occupation}</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Family Picture */}
        <div className="panel family-pic-panel">
          <h3>Family Photo</h3>
          <div className="family-picture">
            <img
              src={`http://api.emmanuelministrieshyd.com/api/users/familyImages/${localStorage.getItem("token")}/${user.HOFMobile}`}
              alt="Family"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=Family&background=random`
              }}
            />
          </div>
        </div>
      </div>

      {/* Panel 3: User Activity (Bottom) */}
      <div className="panel user-activity-panel">
        <h3>User Activity</h3>
        <div className="activity-placeholder">
          <p>User activity will be displayed here in the future.</p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
