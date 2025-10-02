import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDebounce from '../utils/debounce';
import Modal from '../components/Modal';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import Pagination from '../components/Pagination';
import AdminUserForm from '../components/AdminUserForms';
import { useAuth } from '../AuthContext';
import UsersTable from "../components/UsersTable";
import SimpleUsersTable from '../components/SimpleUsersTable';
import '../styles/UserDetailsPage.css';
import Loading from "../components/Loading";
const BASE_URL = 'https://api.emmanuelministrieshyd.com';
const token = localStorage.getItem('token');

function UserDetailsPage() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isAdminDialogOpen,setIsAdminDialogOpen] = useState(false);
    const {isSuperAdmin} = useAuth();
    const debouncedSearchQuery = useDebounce(searchQuery, 100);
    const userId = localStorage.getItem('userId');
    const [pageSize, setPageSize] = useState(10);
    const [loading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/users`, {
                    params: {
                        page: currentPage,
                        limit: pageSize,
                        searchQuery: debouncedSearchQuery
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsLoading(false);
                setUsers(response.data.data);
                setTotalPages(response.data.totalPages);
                
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching users:', error);
            }
        }
        fetchData();
    }, [currentPage, debouncedSearchQuery,pageSize]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);  // Reset to first page when search query changes
    };

    const handleCheckboxChange = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };
 const handleSelectionChange = (selectedIds) => {
    setSelectedUsers(selectedIds)
  }
    const handleNewUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleNewAdminUser = () => {
        setIsAdminDialogOpen(true);
    };

    const handleEditUser = () => {
        const userToEdit = users.find(user => user._id === selectedUsers[0]);
        setEditingUser(userToEdit);
        setIsModalOpen(true);
    };

    const handleDeleteUsers = async () => {
        try {
            await axios.post(`${BASE_URL}/api/users/delete`, { ids: selectedUsers }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userId:userId
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
            if (editingUser) {
                const response = await axios.put(`${BASE_URL}/api/users/${editingUser._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        userId:userId
                    }
                });
                setUsers(users.map(user => (user._id === editingUser._id ? response.data : user)));
            } else {
                const response = await axios.post(`${BASE_URL}/api/users`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        userId:userId
                    }
                });
                setUsers([...users, response.data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert("Error occured, check the log");
            setIsModalOpen(false);
            console.error('Error submitting form:', error);
        }
    };

    const handleAdminUserFormSbmit = async (formData) =>{
        const userId = localStorage.getItem('userId');
        try{
            await axios.post(`${BASE_URL}/api/createAdminUser`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userId:userId
                }
            });
            setIsAdminDialogOpen(false);
        }
        catch(error){
            alert("Error occured, check the log");
            setIsAdminDialogOpen(false);
            console.error('Error submitting form:', error);
        }
    }

    const handleImportData = () => {
        document.getElementById('fileInput').click();
    };
    const getValidData = (data) => {
        return data.filter((user) => user.name && user.mobile && user.bloodGroup && user.city && user.area);
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    try {
                        const token = localStorage.getItem('token');
                        await axios.post(`${BASE_URL}/api/users`, {userId:userId,users: getValidData(results.data)}, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                userId:userId
                            }
                        });
                        const response = await axios.get(`${BASE_URL}/api/users`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }); 
                        setUsers(response.data.data);
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
            email: user.email,
            bloodGroup: user.bloodGroup,
            city: user.city,
            area: user.area,
            HOFMobile: user.HOFMobile,
            gender: user.gender,
            dob: user.dob ? new Date(user.dob).toLocaleDateString() : '',  
            occupation: user.occupation
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'users.csv');
    };

    return (
        <div className="user-details-container">
            <div className="actions">
                {isSuperAdmin && <>
                <button onClick={handleNewUser}>New</button>
                <button className={selectedUsers.length !== 1 ? 'disabled' : ''} onClick={handleEditUser} disabled={selectedUsers.length !== 1}>
                    Edit
                </button>
                <button className={selectedUsers.length === 0 ? 'disabled' : ''} onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
                    Delete
                </button>
                <button onClick={handleNewAdminUser}>New Admin User</button>
                {/* <button onClick={handleImportData}>Import Data</button> */}
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept=".csv"
                    onChange={handleFileChange}
                />
                </>}
                {/* <button onClick={handleExportData}>Export Data</button> */}
                
            </div>
            <h2>User Details</h2>
            <br></br>
            {loading && <div className='loading-container-main'><Loading message="Loadign users..." /></div>}
            <UsersTable users={users} selectedUsers={selectedUsers} onSelectionChange={handleSelectionChange} searchString={debouncedSearchQuery} onSearchChange={handleSearchChange} pageSize={pageSize} setPageSize={setPageSize}/>
            <Pagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                user={editingUser}
            />
            <AdminUserForm
            isOpen={isAdminDialogOpen}
            onClose={()=>setIsAdminDialogOpen(false)}
            onSubmit={handleAdminUserFormSbmit}
            >

            </AdminUserForm>
        </div>
    );
}

export default UserDetailsPage;
