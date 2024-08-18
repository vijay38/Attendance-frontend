import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDebounce from '../utils/debounce';
import Pagination from '../components/Pagination';
import '../styles/UserDetailsPage.css';
const BASE_URL = 'http://localhost:5000';

function UserDetailsPage() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/users`, {
                    params: {
                        page: currentPage,
                        limit: 5,
                        searchQuery: debouncedSearchQuery
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchData();
    }, [currentPage, debouncedSearchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);  // Reset to first page when search query changes
    };

    return (
        <div className="user-details-container">
            <h2>User Details</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name or mobile"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <table className="table-container">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>
                                <img alt="User" className="user-image" src={`http://localhost:5000/api/users/images/${localStorage.getItem('token')}/${user.uniqueId}`} />
                            </td>
                            <td>{user.uniqueId}</td>
                            <td>{user.name}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
            />
        </div>
    );
}

export default UserDetailsPage;
