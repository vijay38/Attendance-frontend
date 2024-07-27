import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import Modal from '../components/Modal';
import '../styles/UserDetailsPage.css';

const images = [ require("../assets/1.jpg"), require("../assets/2.jpg"), require("../assets/3.jpg"), require("../assets/4.jpg"), require("../assets/5.jpg"), require("../assets/6.jpg"),require("../assets/7.jpg")]

function UserDetailsPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleCheckboxChange = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = () => {
        const userToEdit = users.find(user => user._id === selectedUsers[0]);
        setEditingUser(userToEdit);
        setIsModalOpen(true);
    };

    const handleDeleteUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/users/delete', { ids: selectedUsers }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => !selectedUsers.includes(user._id)));
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (editingUser) {
                const response = await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(users.map(user => (user._id === editingUser._id ? response.data : user)));
            } else {
                const response = await axios.post('http://localhost:5000/api/users', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers([...users, response.data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleImportData = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    try {
                        const token = localStorage.getItem('token');
                        await axios.post('http://localhost:5000/api/users', results.data, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        const response = await axios.get('http://localhost:5000/api/users', {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setUsers(response.data);
                    } catch (error) {
                        console.error('Error importing data:', error);
                    }
                },
                error: (error) => {
                    console.error('Error parsing CSV file:', error);
                }
            });
        }
    };

    const handleExportData = () => {
        const csvData = users.map(user => ({
            name: user.name,
            uniqueId: user.uniqueId,
            mobile: user.mobile,
            bloodGroup: user.bloodGroup,
            area: user.area
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'users.csv');
    };

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((val) =>
            val.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="user-details-container">
            <div className="actions">
                <button onClick={handleNewUser}>New</button>
                <button className={selectedUsers.length !== 1 ? 'disabled' : ''} onClick={handleEditUser} disabled={selectedUsers.length !== 1}>
                    Edit
                </button>
                <button className={selectedUsers.length === 0 ? 'disabled' : ''} onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
                    Delete
                </button>
                <button onClick={handleImportData}>Import Data</button>
                <button onClick={handleExportData}>Export Data</button>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept=".csv"
                    onChange={handleFileChange}
                />
            </div>
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
            />
            <table className="table-container">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Image</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Blood Group</th>
                        <th>Area</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, ind) => (
                        <tr key={user._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => handleCheckboxChange(user._id)}
                                />
                            </td>
                            <td>
                                <img alt="User" className="user-image" src={images[ind % 7 ]}></img>
                            </td>
                            <td>{user.uniqueId}</td>
                            <td>{user.name}</td>
                            <td>{user.mobile}</td>
                            <td>{user.bloodGroup}</td>
                            <td>{user.area}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                user={editingUser}
            />
        </div>
    );
}

export default UserDetailsPage;
