import React, { useEffect, useState } from "react";
import SubmissionService from "../services/SubmissionService";
import "../style/submissions.css";
import InternshipService from "../services/InternshipService";

const SecretarySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    SubmissionService.getAllSubmissions()
      .then((response) => {
        const filteredSubmissions = response.data.filter(
          (submission) =>
            submission.secretaryCheck === "UNCHECKED" &&
            submission.advisorCheck === "CHECKED"
        );
        setSubmissions(filteredSubmissions);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
      });
  }, [reload]);

  const handleAcceptClick = (submissionId) => {
    SubmissionService.secretaryApprove(submissionId)
      .then(() => {
        InternshipService.createInternship(submissionId);
        SubmissionService.deleteSubmission(submissionId);
        setReload((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error approving submission:", error);
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
              <th>Accept</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  {submission.sender.name} {submission.sender.surname}
                </td>
                <td>{new Date(submission.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptClick(submission.id)}
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SecretarySubmissions;
