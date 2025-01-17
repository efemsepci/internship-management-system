import React from "react";
import "../style/sideMenu.css";
import { useNavigate } from "react-router-dom";
import logo from "../assests/yeditepe-logo.png";

const SideMenu = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };
  return (
    <div className="side-menu">
      <h2>
        {user.name} {user.surname}
      </h2>
      <ul>
        {user.role === "ADVISOR" && (
          <li>
            <a href="/documents">Documents</a>
          </li>
        )}
        {user.role === "SECRETARY" && (
          <li>
            <a href="/documents">Documents</a>
          </li>
        )}
        {user.role === "STUDENT" && (
          <li>
            <a href="/std-documents">Generate Documents</a>
          </li>
        )}
        {user.role === "ADVISOR" && (
          <li>
            <a href="/submissions">Submissions</a>
          </li>
        )}
        {user.role === "SECRETARY" && (
          <li>
            <a href="/sec-submissions">Submissions</a>
          </li>
        )}
        {user.role === "ADVISOR" && (
          <li>
            <a href="/evaluation">Evaluation</a>
          </li>
        )}
        {user.role === "ADVISOR" && (
          <li>
            <a href="/internships">Internships</a>
          </li>
        )}
        {user.role === "STUDENT" && (
          <li>
            <a href="/make-submission">Make Submission</a>
          </li>
        )}
        {user.role === "STUDENT" && (
          <li>
            <a href="/send-evaluation-form">Send Evaluation Form</a>
          </li>
        )}
        {user.role === "ADMIN" && (
          <li>
            <a href="/users">Users</a>
          </li>
        )}
        <li>
          <a href="/messages">Messages</a>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
    </div>
  );
};

export default SideMenu;
