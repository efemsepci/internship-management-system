import React, { useState, useEffect } from "react";
import "../style/evaluation.css";
import InternshipService from "../services/InternshipService";

const Evaluation = () => {
  const [internships, setInternShips] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    InternshipService.getInternships()
      .then((response) => {
        const filteredInternships = response.data.filter(
          (internship) =>
            internship.isEvaluationForm !== "Yes" ||
            internship.isReport !== "Yes" ||
            internship.grade !== "P"
        );
        console.log(filteredInternships);
        setInternShips(filteredInternships);
      })
      .catch((error) => {
        console.error("Error fetching internships:", error);
      });
  }, [reload]);

  const handleDropdownChange = (id, dropdownName, value) => {
    setInternShips((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, [dropdownName]: value } : row
      )
    );
  };

  const handleInputChange = (id, value) => {
    setInternShips((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, statusDescription: value } : row
      )
    );
  };

  const handleButtonClick = (id) => {
    const internship = internships.find((item) => item.id === id);
    if (!internship) {
      alert("Invalid internship ID");
      return;
    }

    const { isEvaluationForm, isReport, grade, statusDescription } = internship;
    console.log("Internship data:", internship);

    if (isEvaluationForm === "No" || isReport === "No") {
      if (grade === "P") {
        alert(
          "You can not give P grade if there is no report or evaluation form!"
        );
        return;
      }
    }

    InternshipService.updateInternship(
      id,
      isEvaluationForm,
      isReport,
      grade,
      statusDescription
    )
      .then((response) => {
        console.log("Updated successfully", response);
        alert("Internship updated successfully!");
        setReload(!reload);
      })
      .catch((error) => {
        console.error("Error updating internship:", error);
        alert("Failed to update internship.");
      });
  };

  return (
    <div className="table-container">
      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Student ID</th>
            <th>Company</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Evaluation Form</th>
            <th>Report</th>
            <th>Grade</th>
            <th>Status Description</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {internships.map((internship) => (
            <tr key={internship.id}>
              <td>{internship.stdFullName}</td>
              <td>{internship.stdId}</td>
              <td>{internship.companyName}</td>
              <td>{internship.startDate}</td>
              <td>{internship.endDate}</td>
              <td>
                <select
                  value={internship.isEvaluationForm}
                  onChange={(e) =>
                    handleDropdownChange(
                      internship.id,
                      "isEvaluationForm",
                      e.target.value
                    )
                  }
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select
                  value={internship.isReport}
                  onChange={(e) =>
                    handleDropdownChange(
                      internship.id,
                      "isReport",
                      e.target.value
                    )
                  }
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select
                  value={internship.grade}
                  onChange={(e) =>
                    handleDropdownChange(internship.id, "grade", e.target.value)
                  }
                >
                  <option value="">-- Select --</option>
                  <option value="P">P</option>
                  <option value="I">I</option>
                  <option value="F">F</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={internship.statusDescription}
                  onChange={(e) =>
                    handleInputChange(internship.id, e.target.value)
                  }
                  placeholder="Enter description"
                />
              </td>
              <td>
                <button onClick={() => handleButtonClick(internship.id)}>
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Evaluation;
