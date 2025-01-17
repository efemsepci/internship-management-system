import React, { useState } from "react";
import EvaluationService from "../services/EvaluationService";
import "../style/makeSubmission.css";

const SendEvaluationLink = () => {
  const [coordinatorEmail, setCoordinatorEmail] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await EvaluationService.sendEvaluationLink(user.id, coordinatorEmail);
      alert("Evaluation link has been sent to the coordinator's email!");
    } catch (error) {
      console.error("Error sending evaluation link:", error);
      alert("Failed to send evaluation link. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Send Evaluation Link</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter your internship advisor mail</label>
          <input
            type="email"
            value={coordinatorEmail}
            onChange={(e) => setCoordinatorEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Send Link
        </button>
      </form>
    </div>
  );
};

export default SendEvaluationLink;
