import React,{useEffect, useState} from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, onSubmit, user }) {
    const [formData, setFormData] = useState({
        name: user ? user.name : '',
        mobile: user ? user.mobile : '',
        bloodGroup: user ? user.bloodGroup : '',
        uniqueId: user ? user.uniqueId : '',
        area: user ? user.area : '',
        email:user ?  user.email : '',
        city:user ?  user.city : ''
    });
        

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: user ? user.name : '',
                mobile: user ? user.mobile : '',
                bloodGroup: user ? user.bloodGroup : '',
                uniqueId: user ? user.uniqueId : '',
                area: user ? user.area : '',
                email:user ?  user.email : '',
                city:user ?  user.city : ''
            });
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Blood Group</label>
                        <input
                            type="text"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Unique Id</label>
                        <input
                            type="text"
                            name="uniqueId"
                            value={formData.uniqueId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Area</label>
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Modal;
