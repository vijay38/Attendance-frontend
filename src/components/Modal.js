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
        city:user ?  user.city : '',
        HOFMobile: user ? user.HOFMobile : '',
        gender: user && user.gender ? user.gender : '',
        dob: user && user.dob ? user.dob : '',
        occupation: user && user.occupation ? user.occupation : '',
        isFaceDetected: user ? user.isFaceDetected : false
    });
        

    const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
    }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    useEffect(() => {
        if (isOpen) {
            console.log(user);
            setFormData({
                name: user ? user.name : '',
                mobile: user ? user.mobile : '',
                bloodGroup: user ? user.bloodGroup : '',
                uniqueId: user ? user.uniqueId : '',
                area: user ? user.area : '',
                email:user ?  user.email : '',
                city: user ?  user.city : '',
                gender: user ?  user.gender : '',
                dob: user && user.dob ? user.dob.substring(0, 10) : '',
                occupation: user ? user.occupation : '',
                HOFMobile: user ? user.HOFMobile : '',
                isFaceDetected: user ? user.isFaceDetected : false
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
                            disabled={user ? true : false}
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
                    <div>
                        <label>Head of the family No.</label>
                        <input
                            type="text"
                            name="HOFMobile"
                            value={formData.HOFMobile}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                    <div>
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Occupation</label>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
                    </div>
                    <div>
                        <label>
                        <input
                            type="checkbox"
                            name="isFaceDetected"
                            checked={formData.isFaceDetected}
                            onChange={handleChange}
                        />
                        Face Detected
                        </label>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Modal;
