import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from "../services/UserService";
import '../style/loginScreen.css';

const LoginScreen = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await UserService.getUserByEmail(formData.email);
          if (response.status === 200 && response.data.password === formData.password) {
            sessionStorage.setItem("user", JSON.stringify(response.data));
            if(response.data.role === 'ADVISOR' || response.data.role === 'SECRETARY'){
              navigate('/documents');
            }
            else if(response.data.role === 'STUDENT'){
              navigate('/std-documents');
            }
            else if(response.data.role === 'ADMIN'){
              navigate('/users');
            }
          }else{
            alert("Wrong password or email!!!");
          }
        } catch (err) {
          console.error("Error during login:", err);
          alert("Login failed!");
        }
      };
      
    
      const navigate = useNavigate();

    const handleRegisterClick = () => {
    navigate('/register');  
  };
    
      return (
        <div className="login-container">
          <div className="login-box">
            <h2 className='login-title'>Internship Management System</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="text"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
              />
              <div className="button-group">
                <button type="submit" className="btn login-btn">
                  Login
                </button>
                <button type="button" className="btn register-btn" onClick={handleRegisterClick}>
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

export default LoginScreen;
