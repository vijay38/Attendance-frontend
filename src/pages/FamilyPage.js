import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FamilyPage.css";

const BASE_URL = 'http://localhost:5000';
const FamilyPage = () => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchFamilies = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/users/families`,
                    {
                    headers: {
                        Authorization: `Bearer ${token}`
                }
            });
                setFamilies(response.data);
            } catch (err) {
                setError("Failed to load families.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFamilies();
    }, []);

    return (
        <div className="family-table">
            <h2 className="title">Family Details</h2>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Image</th>
                                <th>Head of the Family</th>
                                <th>Mobile</th>
                                <th>Members</th>
                                <th>Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {families.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="no-data">No family records found.</td>
                                </tr>
                            ) : (
                                families.map((family, index) => (
                                    <tr key={family.head_of_family.uniqueId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img alt="User" className="user-image" src={`http://localhost:5000/api/users/images/${localStorage.getItem('token')}/${family.head_of_family.uniqueId}`} />
                                        </td>
                                        <td>{family.head_of_family.name}</td>
                                        <td>{family.head_of_family.mobile}</td>
                                        <td>
                                            {family.head_of_family.members.length > 0 ? (
                                                <ul className="members-list">
                                                    {family.head_of_family.members.map((member) => (
                                                        <li key={member.uniqueId}>{member.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="no-members">No Members</span>
                                            )}
                                        </td>
                                        <td>{family.head_of_family.area || "N/A"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FamilyPage;