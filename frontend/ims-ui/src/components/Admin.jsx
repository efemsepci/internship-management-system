import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import "../style/admin.css";

const Admin = () => {
  const loginedUser = JSON.parse(sessionStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "",
  });
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    UserService.getUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const toggleCreateUserForm = () => {
    setShowCreateUserForm(!showCreateUserForm);
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    const { name, surname, role, password, email } = newUser;
    const department = "CSE";
    if (newUser.role === "ADMIN") {
      UserService.createAdmin({ name, surname, role, password, email })
        .then(() => {
          loadUsers();
          setShowCreateUserForm(false);
          setNewUser({
            name: "",
            surname: "",
            role: "",
            password: "",
            email: "",
          });
        })
        .catch((error) => console.error("Error creating admin:", error));
    } else if (newUser.role === "ADVISOR") {
      UserService.createAdvisor({
        name,
        surname,
        role,
        password,
        email,
        department,
      })
        .then(() => {
          loadUsers();
          setShowCreateUserForm(false);
          setNewUser({
            name: "",
            surname: "",
            role: "",
            password: "",
            email: "",
          });
        })
        .catch((error) => console.error("Error creating advisor:", error));
    } else if (newUser.role === "SECRETARY") {
      UserService.createSecretary({
        name,
        surname,
        role,
        password,
        email,
        department,
      }).then(() => {
        loadUsers();
        setShowCreateUserForm(false);
        setNewUser({
          name: "",
          surname: "",
          role: "",
          password: "",
          email: "",
        });
      });
    }
  };

  const handleDeleteUser = (id) => {
    UserService.deleteUser(id)
      .then(() => {
        loadUsers();
        setUserToDelete(null);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="admin-container">
      <div className="user-list">
        <h3>All Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} {user.surname} - {user.role}{" "}
              {user.id !== loginedUser.id && (
                <button onClick={() => setUserToDelete(user.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
        <button className="create-user-btn" onClick={toggleCreateUserForm}>
          Create User
        </button>
      </div>
      {showCreateUserForm && (
        <div className="create-user-form">
          <h4>Create New User</h4>
          <form onSubmit={handleCreateUserSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Surname"
              value={newUser.surname}
              onChange={(e) =>
                setNewUser({ ...newUser, surname: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="">---Select Role---</option>
              <option value="ADVISOR">Advisor</option>
              <option value="SECRETARY">Secretary</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit" onClick={handleCreateUserSubmit}>
              Create User
            </button>
            <button type="button" onClick={toggleCreateUserForm}>
              Close
            </button>
          </form>
        </div>
      )}

      {userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Are you sure you want to delete this user?</h4>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => handleDeleteUser(userToDelete)}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setUserToDelete(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
