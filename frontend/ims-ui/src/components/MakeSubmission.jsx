import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import SubmissionService from "../services/SubmissionService";
import "../style/makeSubmission.css";

const MakeSubmission = () => {
  const [file, setFile] = useState(null);
  const [reload, setReload] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    SubmissionService.getSubmissionsBySender(user.id)
      .then((response) => {
        const submissionId = response.data[0].id;
        console.log(submissionId);
        SubmissionService.completeSubmission(submissionId, file)
          .then(() => {
            console.log(
              "File uploaded successfully for submission:",
              submissionId
            );
            alert("Submission and file upload successful!");
            setReload((prev) => !prev);
          })
          .catch((error) => {
            console.error("Error uploading file for submission:", error);
            alert("Error uploading file. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Error submitting submission data:", error);
        alert("Error submitting pdf. Please fill forms before!");
      });
  };

  return (
    <div className="form-container">
      <h2 className="forms-title">Internship Submission Form</h2>
      <form onSubmit={handleSubmit} className="custom-form">
        <h3>File</h3>
        <div className="form-group">
          <label>Upload Internship Documents (.pdf)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          {file && <p>Selected File: {file.name}</p>}
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MakeSubmission;
