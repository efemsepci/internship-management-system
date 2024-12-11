import axios from "axios";

const USER_API_URL = "http://localhost:8080/api/usr/users";

class UserService {
  getUsers() {
    return axios.get(USER_API_URL);
  }
  getUserById(id) {
    return axios.get(USER_API_URL + "/" + id);
  }
  getUserByRole(role) {
    return axios.get(USER_API_URL + "/role/" + role);
  }
  getUserByEmail(email) {
    return axios.get(USER_API_URL + "/email/" + email);
  }
  createStudent(student) {
    return axios.post(USER_API_URL + "/student", student);
  }
  createAdvisor(advisor) {
    return axios.post(USER_API_URL + "/advisor", advisor);
  }
  createSecretary(secretary) {
    return axios.post(USER_API_URL + "/secretary", secretary);
  }
  createAdmin(admin) {
    return axios.post(USER_API_URL + "/admin", admin);
  }
  deleteUser(id) {
    return axios.delete(USER_API_URL + "/" + id);
  }
}

export default new UserService();
