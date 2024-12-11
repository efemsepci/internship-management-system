import axios from "axios";

const DOCUMENTS_API_URL = "http://localhost:8080/api/documents";

class DocumentsService {
  getDocuments() {
    return axios.get(DOCUMENTS_API_URL);
  }
  getDocumentById(id) {
    return axios.get(DOCUMENTS_API_URL + "/" + id);
  }
  uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(DOCUMENTS_API_URL, formData);
  }
  deleteDocument(id) {
    return axios.delete(DOCUMENTS_API_URL + "/" + id);
  }
  downloadDocument(id) {
    return axios.get(DOCUMENTS_API_URL + "/download/" + id, {
      responseType: "blob",
    });
  }
}

export default new DocumentsService();
