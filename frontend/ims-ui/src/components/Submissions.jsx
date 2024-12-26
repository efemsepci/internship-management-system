import React, { useEffect, useState } from "react";
import SubmissionService from "../services/SubmissionService";
import MessageService from "../services/MessageService";
import "../style/submissions.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reload, setReload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    SubmissionService.getSubmissions(user.id)
      .then((response) => {
        const filteredSubmissions = response.data.filter(
          (submission) =>
            submission.advisorCheck === "UNCHECKED" &&
            submission.fileContent !== null
        );
        setSubmissions(filteredSubmissions);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
      });
  }, [user.id, reload]);

  const handleDownload = (submissionId) => {
    SubmissionService.downloadFile(submissionId)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `submission_${submissionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  };
  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    console.log(submission.stdFullName);
  };
  const handleAcceptClick = (submission) => {
    SubmissionService.advisorApprove(submission.id)
      .then(() => {
        setReload((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error approving submission:", error);
      });
  };

  const handleDeclineClick = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDeclineMessage("");
  };

  const handleConfirmDecline = () => {
    if (declineMessage.trim() === "") {
      alert("Please provide a reason for declining!");
      return;
    }
    MessageService.sendMessage(
      user.id,
      selectedSubmission.sender.id,
      declineMessage
    )
      .then(() => {
        setDeclineMessage("");
      })
      .catch((error) => {
        console.error("Error, can not send message!", error);
      });

    SubmissionService.deleteSubmission(selectedSubmission.id)
      .then(() => {
        setReload((prev) => !prev);
        setIsModalOpen(false);
        setDeclineMessage("");
        setSelectedSubmission(null);
      })
      .catch((error) => {
        console.error("Error deleting submission:", error);
      });
  };

  return (
    <div className="submission-list-container">
      <h2>Submission List</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table className="submission-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Date</th>
              <th>Accept Submission</th>
              <th>Decline Submission</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                onClick={() => handleSubmissionClick(submission)}
              >
                <td>
                  {submission.sender.name} {submission.sender.surname}
                </td>
                <td>{new Date(submission.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleAcceptClick(submission)}>
                    Accept
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeclineClick(submission)}>
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedSubmission && (
        <div className="submission-details">
          <h3>Submission Details</h3>
          <p>
            <strong>ID:</strong> {selectedSubmission.id}
          </p>
          <p>
            <strong>Sender:</strong> {selectedSubmission.sender.name}{" "}
            {selectedSubmission.sender.surname}
          </p>
          <p>
            <strong>Receiver:</strong> {selectedSubmission.receiver.name}{" "}
            {selectedSubmission.receiver.surname}
          </p>
          <p>
            <strong>File:</strong>
            <button
              className="download-btn"
              onClick={() => handleDownload(selectedSubmission.id)}
            >
              Download
            </button>
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedSubmission.createdAt).toLocaleString()}
          </p>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Decline Submission</h3>
            <textarea
              value={declineMessage}
              onChange={(e) => setDeclineMessage(e.target.value)}
              placeholder="Provide a reason for declining..."
            ></textarea>
            <button className="modal-btn" onClick={handleConfirmDecline}>
              Confirm
            </button>
            <button className="modal-btn cancel" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
