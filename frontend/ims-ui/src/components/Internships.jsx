import React, { useState, useEffect } from "react";
import InternshipService from "../services/InternshipService";
import "../style/internships.css";
import * as XLSX from "xlsx";

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
      .then((response) => {
        const filteredData = response.data.filter(
          (internship) => internship.grade === "P"
        );
        setInternships(filteredData);
      })
      .catch((error) => console.error("Error fetching internships:", error));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDownloadExcel = () => {
    const data = filteredInternships.map((internship) => ({
      "Student Name": internship.stdName,
      "Student Surname": internship.stdSurname,
      "Student ID": internship.stdId,
      "Phone Number": internship.phoneNumber,
      "Birth Place & Date": internship.birthPlaceDate,
      Department: internship.department,
      "Completed Credit": internship.completedCredit,
      GPA: internship.gpa,
      "Internship Type": internship.internshipType,
      "Voluntary or Mandatory": internship.voluntaryOrMandatory,
      "Graduation Status": internship.graduationStatus,
      "Summer School": internship.summerSchool,
      Description: internship.description,
      "Company Name": internship.companyName,
      Address: internship.address,
      "Intern Department": internship.internDepartment,
      "Start Date": internship.startDate,
      "End Date": internship.endDate,
      "Internship Days": internship.internshipDays,
      "Company Phone Number": internship.companyPhoneNumber,
      Sector: internship.sector,
      "Personnel Number": internship.personnelNumber,
      "Department Personnel Number": internship.departmentPersonnelNumber,
      "Department CENG Number": internship.departmentCENGNumber,
      "Intern Advisor Full Name": internship.internAdvisorFullName,
      "Intern Advisor Phone": internship.internAdvisorPhone,
      "Intern Advisor Mail": internship.internAdvisorMail,
      "Intern Advisor Job": internship.internAdvisorJob,
      "Internship Topic": internship.internshipTopic,
      "Evaluation Form Submitted": internship.isEvaluationForm,
      "Report Submitted": internship.isReport,
      Grade: internship.grade,
      "Status Description": internship.statusDescription,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Internships");
    XLSX.writeFile(workbook, "Internships.xlsx");
  };

  const filteredInternships = internships.filter((internship) => {
    const internshipYear = internship.startDate.split("-")[0];
    return (
      (filters.companyName === "" ||
        internship.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase())) &&
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
      <button className="download-btn" onClick={handleDownloadExcel}>
        Download Internships
      </button>
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
