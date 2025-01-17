import axios from "axios";

const EVALUATION_API_URL = "http://localhost:8080/api/evaluations";

class EvaluationService {
  getAllEvaluations() {
    return axios.get(EVALUATION_API_URL);
  }
  getEvaluationById(id) {
    return axios.get(EVALUATION_API_URL + "/" + id);
  }
  createEvaluation(evaluation) {
    return axios.post(EVALUATION_API_URL, evaluation);
  }
  deleteEvaluation(id) {
    return axios.delete(EVALUATION_API_URL + "/" + id);
  }
  getByUserId(userId) {
    return axios.get(EVALUATION_API_URL + "/user/" + userId);
  }
  sendEvaluationLink(studentId, coordinatorEmail) {
    return axios.post(
      EVALUATION_API_URL +
        "/send-evaluation-link?studentId=" +
        studentId +
        "&coordinatorEmail=" +
        coordinatorEmail
    );
  }
}

export default new EvaluationService();
