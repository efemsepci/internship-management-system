import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import UserService from "../services/UserService";
import '../style/registerScreen.css';


const RegisterScreen = () => {
  const navigate = useNavigate();
  const role = "STUDENT";
  const internshipStatus = "NOT_DONE";
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    department: 'CSE',
    studentId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@std\.yeditepe\.edu\.tr$/;
    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address with the '@std.yeditepe.edu.tr'");
      return;
    }
  
    try {
      const tempUser = await UserService.getUserByEmail(formData.email);
      console.log(tempUser);
  
      if (tempUser.data === '') {
        const user = { ...formData, role, internshipStatus };
        const createResponse = await UserService.createStudent(user);
        
        sessionStorage.setItem("user", JSON.stringify(createResponse.data));
        navigate('/documents');
      } else {
        alert("Already Registered!!!");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("Registration failed!");
    }
  };
  
  
  

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className='register-title'>Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className='input-field'
            required
          />
          <select onChange={handleChange} value={formData.department}>
            <option value="CSE">CSE</option>
          </select>
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={handleChange}
              className="input-field"
              required
            />
          <div className="button-group">
            <button type="submit" className="btn register-btn">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
