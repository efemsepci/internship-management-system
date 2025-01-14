import React, { useState, useEffect } from "react";
import DocumentsService from "../services/DocumentsService";
import HolidaysService from "../services/HolidaysService";
import "../style/documents.css";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [isHolidayModal, setIsHolidayModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [holidayData, setHolidayData] = useState({
    startDate: "",
    endDate: "",
    description: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    DocumentsService.getDocuments()
      .then((response) => setDocuments(response.data))
      .catch((error) => console.error("Error fetching documents!", error));

    loadHolidays();
  }, []);

  const loadHolidays = () => {
    HolidaysService.getHolidays()
      .then((response) => setHolidays(response.data))
      .catch((error) => console.error("Error fetching holidays!", error));
  };

  const handleDeleteDocument = (documentId) => {
    DocumentsService.deleteDocument(documentId)
      .then(() =>
        setDocuments(documents.filter((doc) => doc.id !== documentId))
      )
      .catch((error) => console.error("Error deleting document!", error));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = () => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      DocumentsService.uploadDocument(selectedFile)
        .then(() => {
          setIsUploadModal(false);
          setSelectedFile(null);
          DocumentsService.getDocuments()
            .then((response) => setDocuments(response.data))
            .catch((error) => console.error("Error fetching documents", error));
        })
        .catch((error) => console.error("Error uploading document!", error));
    } else {
      alert("Only PDF files are allowed!");
    }
  };

  const handleDownload = (documentId, fileName) => {
    DocumentsService.downloadDocument(documentId)
      .then((response) => {
        if (!response.data || response.data.size === 0)
          throw new Error("Empty or invalid PDF response");

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading document!", error));
  };

  const handleHolidayChange = (e) => {
    const { name, value } = e.target;
    setHolidayData({ ...holidayData, [name]: value });
  };

  const handleHolidayUpload = () => {
    HolidaysService.createHolidays(holidayData)
      .then(() => {
        setIsHolidayModal(false);
        setHolidayData({ startDate: "", endDate: "", description: "" });
        loadHolidays();
      })
      .catch((error) => console.error("Error adding holiday!", error));
  };

  const handleDeleteHoliday = (id) => {
    HolidaysService.deleteHoliday(id)
      .then(() => setHolidays(holidays.filter((holiday) => holiday.id !== id)))
      .catch((error) => console.error("Error deleting holiday!", error));
  };

  return (
    <div className="documents-container">
      <h2 className="documents-title">Documents</h2>
      <ul className="documents-list">
        {documents.map((document) => (
          <li key={document.id} className="document-item">
            <button
              onClick={() => handleDownload(document.id, document.fileName)}
              className="download-btn"
            >
              {document.fileName}
            </button>
            <button
              onClick={() => handleDeleteDocument(document.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setIsUploadModal(true)}
        className="add-document-btn"
      >
        Add Document
      </button>
      {user.role === "ADVISOR" && (
        <button
          onClick={() => setIsHolidayModal(true)}
          className="manage-holiday-btn"
        >
          Manage Holidays
        </button>
      )}

      {isUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload New Document</h3>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <div className="modal-buttons">
              <button className="modal-upload-btn" onClick={handleUpload}>
                Upload
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => setIsUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isHolidayModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add or Manage Holidays</h3>
            <h4>Existing Holidays</h4>
            <ul className="holiday-list">
              {holidays.map((holiday) => (
                <li key={holiday.id} className="holiday-item">
                  {holiday.startDate} - {holiday.endDate}: {holiday.description}
                  <button
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h4>Add New Holiday</h4>
            <input
              type="date"
              name="startDate"
              value={holidayData.startDate}
              onChange={handleHolidayChange}
              placeholder="Start Date"
            />
            <input
              type="date"
              name="endDate"
              value={holidayData.endDate}
              onChange={handleHolidayChange}
              placeholder="End Date"
            />
            <input
              style={{ marginTop: 5 }}
              type="text"
              name="description"
              value={holidayData.description}
              onChange={handleHolidayChange}
              placeholder="Description"
            />
            <div className="modal-buttons">
              <button
                className="modal-upload-btn"
                onClick={handleHolidayUpload}
              >
                Add Holiday
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => setIsHolidayModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
