import axios from "axios";

const INTERNSHIP_API_URL = "http://localhost:8080/api/internships";

class InternshipService {
  getInternships() {
    return axios.get(INTERNSHIP_API_URL);
  }
  getInternshipById(id) {
    return axios.get(INTERNSHIP_API_URL + "/" + id);
  }
  createInternship(submissionId) {
    return axios.post(INTERNSHIP_API_URL + "/create/" + submissionId);
  }
}

export default new InternshipService();