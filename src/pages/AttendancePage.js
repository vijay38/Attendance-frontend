// AttendancePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import '../styles/AttendancePage.css';
const BASE_URL = 'http://localhost:5000';
// Sample image URL
// const defaultImageUrl = 'https://i.pinimg.com/originals/ed/18/91/ed189191dc22169f0e6786a85f068616.jpg';

const images = [require("../assets/1.jpg"),require("../assets/2.jpg"),require("../assets/3.jpg"),require("../assets/4.jpg"),require("../assets/5.jpg"),require("../assets/6.jpg")]
function AttendancePage() {
    const [attendees, setAttendees] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [formattedDate,setFormattedDate] = useState(null);

    useEffect(() => {
        if (!selectedDate) return;
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/absentees?date=${formattedDate}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAttendees(response.data);
            } catch (error) {
                console.error('Error fetching absentees:', error);
            }
        }
        fetchData();
    }, [formattedDate,selectedDate]);
    

    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    setFormattedDate(formattedDate.replaceAll('/','-'));
    setSelectedDate(e.target.value)
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
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

    const filteredAttendees = attendees.filter(
        (attendee) =>
            attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.mobile.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    {filteredAttendees.map((attendee,ind) => (
                        <tr key={attendee._id}>
                            <td>
                                {/* <img src={attendee.imageUrl || defaultImageUrl} alt="Attendee" className="attendee-image" /> */}
                                <img alt="User" className="user-image" src={images[ind % 6 ]}></img>
                                {/* <img alt="User" className="user-image" src={' https://firebasestorage.googleapis.com/v0/b/attendance-management-da7a6.appspot.com/o/userImages%2F'+attendee.uniqueId+'.jpg?alt=media'}></img> */}
                                                       
                            </td>
                            <td>{attendee.uniqueId}</td>
                            <td>{attendee.name}</td>
                            <td>{attendee.mobile}</td>
                            <td>{attendee.area}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AttendancePage;
