import axios from "axios";

const SUBMISSION_API_URL = "http://localhost:8080/api/submissions";

class SubmissionService {
  createSubmission(senderId, receiverId, file, formValues) {
    const formData = new FormData();

    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    formData.append("file", file);
    formData.append("formValues", JSON.stringify(formValues));

    return axios.post(`${SUBMISSION_API_URL}/make`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  downloadFile(id) {
    return axios.get(SUBMISSION_API_URL + "/download/" + id, {
      responseType: "blob",
    });
  }

  advisorApprove(id) {
    return axios.post(SUBMISSION_API_URL + "/" + id + "/advisor");
  }
  secretaryApprove(id) {
    return axios.post(SUBMISSION_API_URL + "/" + id + "/secretary");
  }
  getSubmissions(userId) {
    return axios.get(SUBMISSION_API_URL + "/" + userId);
  }
  getSubmissionsBySender(senderId) {
    return axios.get(SUBMISSION_API_URL + "/sender/" + senderId);
  }
  getAllSubmissions() {
    return axios.get(SUBMISSION_API_URL);
  }
  deleteSubmission(id) {
    return axios.delete(SUBMISSION_API_URL + "/" + id);
  }
}

export default new SubmissionService();
