import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import "../styles/FamilyPage.css";

const BASE_URL = 'http://api.emmanuelministrieshyd.com';

const FamilyPage = () => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFamilies = async (page = 1, limit = pageSize) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/api/users/families`, {
                params: { page, limit },
                headers: { Authorization: `Bearer ${token}` }
            });

            setFamilies(response.data.data || response.data);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError("Failed to load families.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamilies(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // Export all families as CSV
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetch all families by passing a large limit
            const response = await axios.get(`${BASE_URL}/api/users/families`, {
                params: { page: 1, limit: 100000 },
                headers: { Authorization: `Bearer ${token}` }
            });

            const allFamilies = response.data.data || response.data;

            // Convert to CSV format
            const csvData = allFamilies.map(fam => {
                const hof = fam.head_of_family;
                return {
                    HOF_Name: hof.name,
                    HOF_Mobile: hof.mobile,
                    HOF_UniqueId: hof.uniqueId,
                    Area: hof.area,
                    Members: hof.members.map(m => m.name).join(", ") || "No Members"
                };
            });

            const csv = Papa.unparse(csvData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const today = new Date().toISOString().split('T')[0];
            saveAs(blob, `families_${today}.csv`);
        } catch (err) {
            console.error("Error exporting families:", err);
        }
    };

    return (
        <div className="family-table">
            <h2 className="title">Family Details</h2>

            <div className="controls">
                <label>Records per page: </label>
                <select value={pageSize} onChange={handlePageSizeChange}>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={80}>80</option>
                    <option value={100}>100</option>
                </select>

                <button onClick={handleExportData}>Export CSV</button>
            </div>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
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
                                        <td colSpan="6" className="no-data">No family records found.</td>
                                    </tr>
                                ) : (
                                    families.map((family, index) => (
                                        <tr key={family.head_of_family.uniqueId}>
                                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                            <td>
                                                <img
                                                    className="user-image"
                                                    src={`${BASE_URL}/api/users/familyImages/${localStorage.getItem('token')}/${family.head_of_family.mobile}`}
                                                    alt={family.head_of_family.name}
                                                    onError={(e) => {
                                                    (e.target).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        family.head_of_family.name,
                                                    )}&background=random`
                                                    }}
                                                />
                                            </td>
                                            <td>{family.head_of_family.name}</td>
                                            <td>{family.head_of_family.mobile}</td>
                                            <td>
                                                {family.head_of_family.members.length > 0 ? (
                                                    <ul className="members-list">
                                                        {family.head_of_family.members.map(member => (
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

                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span> Page {currentPage} of {totalPages} </span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FamilyPage;