// AttendancePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import useDebounce from '../utils/debounce';
import '../styles/AttendancePage.css';
import Pagination from '../components/Pagination';
const BASE_URL = 'http://localhost:5000';
// Sample image URL
// const defaultImageUrl = 'https://i.pinimg.com/originals/ed/18/91/ed189191dc22169f0e6786a85f068616.jpg';

function AttendancePage() {
    const [attendees, setAttendees] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [formattedDate, setFormattedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    useEffect(() => {
        if (!selectedDate) return;
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/dbattendance`, {
                    params: {
                        date: formattedDate,
                        page: currentPage,
                        limit: 10,
                        searchQuery: debouncedSearchQuery  
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAttendees(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching absentees:', error);
            }
        }
        fetchData();
    }, [formattedDate, selectedDate, currentPage, debouncedSearchQuery]);

    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        setFormattedDate(formattedDate);
        setSelectedDate(e.target.value);
        setCurrentPage(1);  // Reset to first page when date changes
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);  // Reset to first page when search query changes
    };

    const handleExportData = () => {
        const csvData = attendees.map(attendee => ({
            name: attendee.name,
            uniqueId: attendee.uniqueId,
            mobile: attendee.mobile,
            area: attendee.area
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'absentees.csv');
    };

    return (
        <div className="attendance-container">
            <h2>Absentees List</h2>
            <div>
                <label>Select Date: </label>
                <input type="date" value={selectedDate} onChange={handleDateChange} />
            </div>
            <div className="actions">
                <button onClick={handleExportData}>Export Data</button>
            </div>
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
                        <th>Area</th>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee, ind) => (
                        <tr key={attendee.EmployeeId}>
                            <td>
                                <img alt="User" className="user-image" src={`http://localhost:5000/api/users/images/${localStorage.getItem('token')}/${attendee.EmployeeCode}`}></img>
                            </td>
                            <td>{attendee.EmployeeCode}</td>
                            <td>{attendee.EmployeeName}</td>
                            <td>{attendee.mobile || ""}</td>
                            <td>{attendee.area}</td>
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


export default AttendancePage;
