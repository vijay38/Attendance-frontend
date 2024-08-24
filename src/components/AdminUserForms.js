import React, { useState } from 'react';
import './AdminUserForm.css';
const AdminUserForm = ({ isOpen, onClose, onSubmit }) => {
    // State to store form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        permission: 'read' // Default value for permission
    });

    // Handle input changes and update form state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Call the onSubmit function with form data
    };

    // Render nothing if the form is not open
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Create New Admin User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Permission:</label>
                        <select
                            name="permission"
                            value={formData.permission}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="read">Read</option>
                            <option value="readWrite">Read & Write</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">Create User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUserForm;
