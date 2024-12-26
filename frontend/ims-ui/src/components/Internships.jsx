import React, { useState, useEffect } from "react";
import InternshipService from "../services/InternshipService";
import "../style/internships.css";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    year: "",
  });

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = () => {
    InternshipService.getInternships()
      .then((response) => setInternships(response.data))
      .catch((error) => console.error("Error fetching internships:", error));
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredInternships = internships.filter((internship) => {
    const internshipYear = internship.startDate.split("-")[0];
    return (
      (filters.companyName === "" ||
        internship.companyName.includes(filters.companyName)) &&
      (filters.year === "" || internshipYear === filters.year)
    );
  });

  return (
    <div className="internship-list-container">
      <h2>Internship List</h2>
      <div className="filters">
        <div className="form-group">
          <label>Filter by Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={filters.companyName}
            onChange={handleFilterChange}
            placeholder="Enter company name"
          />
        </div>
        <div className="form-group">
          <label>Filter by Year:</label>
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="Enter year"
          />
        </div>
      </div>
      <div className="internship-list">
        {filteredInternships.length > 0 ? (
          <table className="internship-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Start Date</th>
                <th>Student</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.map((internship) => (
                <tr key={internship.id}>
                  <td>{internship.companyName}</td>
                  <td>{internship.startDate}</td>
                  <td>
                    {internship.stdName} {internship.stdSurname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No internships found matching the filters.</p>
        )}
      </div>
    </div>
  );
};

export default Internships;
