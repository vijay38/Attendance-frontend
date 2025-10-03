// AttendancePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import useDebounce from '../utils/debounce';
import '../styles/AttendancePage.css';
import Pagination from '../components/Pagination';

const BASE_URL = 'https://api.emmanuelministrieshyd.com';

function AttendancePage() {
    const [attendees, setAttendees] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [filterType, setFilterType] = useState("absent");
    const [searchQuery, setSearchQuery] = useState('');
    const [formattedDate, setFormattedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Fetch attendance data
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
                        searchQuery: debouncedSearchQuery,
                        filter: filterType
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAttendees(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        }

        fetchData();
    }, [formattedDate, selectedDate, currentPage, debouncedSearchQuery, filterType]);

    // Handle date change
    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        setFormattedDate(formattedDate);
        setSelectedDate(e.target.value);
        setCurrentPage(1);
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Export all records of selected type
    const handleExportData = async () => {
        if (!selectedDate) return;
        try {
            const token = localStorage.getItem('token');

            // Fetch all records without pagination
            const response = await axios.get(`${BASE_URL}/api/dbattendance`, {
                params: {
                    date: formattedDate,
                    page: 1,
                    limit: 100000, // large number to get all
                    filter: filterType
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const dataToExport = response.data.data.map(attendee => ({
                EmployeeCode: attendee.EmployeeCode,
                EmployeeName: attendee.EmployeeName,
                Mobile: attendee.Mobile,
                Area: attendee.Area,
                AttendanceStatus: attendee.AttendanceStatus
            }));

            const csv = Papa.unparse(dataToExport);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${filterType}_${formattedDate}.csv`);

        } catch (err) {
            console.error('Error exporting data:', err);
        }
    };

    return (
        <div className="attendance-container">
            <h2>Attendance List</h2>
            <div className="controls">
                <label>Select Date: </label>
                <input type="date" value={selectedDate || ''} onChange={handleDateChange} />

                <label>Filter: </label>
                <select value={filterType} onChange={handleFilterChange}>
                    <option value="absent">Absent</option>
                    <option value="present">Present</option>
                    <option value="all">All</option>
                </select>

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
                        <th>Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => (
                        <tr key={attendee.EmployeeId}>
                            <td>
                                <img
                                    alt="User"
                                    className="user-image"
                                    src={`${BASE_URL}/api/users/images/${localStorage.getItem('token')}/${attendee.EmployeeCode}`}
                                />
                            </td>
                            <td>{attendee.EmployeeCode}</td>
                            <td>{attendee.EmployeeName}</td>
                            <td>{attendee.Mobile || ""}</td>
                            <td>{attendee.Area}</td>
                            <td>{attendee.AttendanceStatus}</td>
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
