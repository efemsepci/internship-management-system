import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import SubmissionService from "../services/SubmissionService";
import "../style/makeSubmission.css";

const MakeSubmission = () => {
  const [formData, setFormData] = useState({
    stdFullName: "",
    stdId: "",
    phoneNumber: "",
    birthPlaceDate: "",
    department: "",
    completedCredit: "",
    gpa: "",
    internshipType: "",
    voluntaryOrMandatory: "",
    graduationStatus: "",
    summerSchool: "",
    description: "",
    companyName: "",
    address: "",
    internDepartment: "",
    startDate: "",
    endDate: "",
    internshipDays: "",
    companyPhoneNumber: "",
    sector: "",
    personnelNumber: "",
    departmentPersonnelNumber: "",
    departmentCENGNumber: "",
    internAdvisorFullName: "",
    internAdvisorPhone: "",
    internAdvisorMail: "",
    internshipTopic: "",
    advisor: "",
  });

  const [file, setFile] = useState(null);
  const [advisors, setAdvisors] = useState([]);
  const [submissionCheck, setSubmissionCheck] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [reload, setReload] = useState(false); 
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    UserService.getUserByRole("ADVISOR")
      .then((response) => {
        setAdvisors(response.data);
      })
      .catch((error) => {
        console.error("Error, can not load advisors!", error);
      });
    SubmissionService.getSubmissionsBySender(user.id)
      .then((response) => {
        setSubmissionCheck(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [reload]);

  const calculateWorkDays = (start, end) => {
    console.log(start, end)
    let startDate = new Date(start);
    console.log(startDate.toLocaleDateString())
    const endDate = new Date(end);
    let workDayCount = 0;

    while (startDate <= endDate) {
      const dayOfWeek = startDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDayCount++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    console.log(workDayCount)
    return workDayCount;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    setErrorMessage("");

    const calculatedWorkDays = calculateWorkDays(formData.startDate, formData.endDate);

    if (calculatedWorkDays < 20) {
      setErrorMessage("The work days between the start date and end date must be at least 20 days!");
      alert(errorMessage);
      return;
    }

    if (parseInt(formData.internshipDays) < 20) {
      setErrorMessage("Entered work days must be at least 20 days!");
      alert(errorMessage);
      return;
    }

    if (parseInt(formData.internshipDays) !== calculatedWorkDays) {
      setErrorMessage("Entered work days must be equal calculated work day!");
      alert(errorMessage);
      return;
    }
    console.log(submissionCheck);
    if(submissionCheck.length === 0){
      SubmissionService.createSubmission(
        user.id, 
        formData.advisor, 
        file, 
        { ...formData }
      )
        .then((response) => {
          console.log("Submission data sent successfully:", response.data);
          alert("Submission sent!")
          setReload((prev) => !prev);
        })
        .catch((error) => {
          console.error("Error submitting submission data:", error);
        });
    }
    else{
      alert("You have submitted submission!!!")
      setReload((prev) => !prev);
      return;
    }
  };

  return (
    <div className="form-container">
      <h2 className="forms-title">Internship Submission Form</h2>
      <form onSubmit={handleSubmit} className="custom-form">
        <h3>Student Information</h3>
        {[
          { label: "Full Name", name: "stdFullName", type: "text" },
          { label: "Student ID", name: "stdId", type: "text" },
          { label: "Phone Number", name: "phoneNumber", type: "tel" },
          { label: "Birth Place and Date", name: "birthPlaceDate", type: "text" },
          { label: "Department", name: "department", type: "text" },
          { label: "Completed Credit", name: "completedCredit", type: "number" },
          { label: "GPA", name: "gpa", type: "number", step: "0.01" },
          { label: "Description", name: "description", type: "text" },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              step={field.step}
              value={formData[field.name]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label>Internship Type</label>
          <select
            name="internshipType"
            value={formData.internshipType}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
        <div className="form-group">
          <label>Voluntary or Mandatory</label>
          <select
            name="voluntaryOrMandatory"
            value={formData.voluntaryOrMandatory}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Option --</option>
            <option value="voluntary">Voluntary</option>
            <option value="mandatory">Mandatory</option>
          </select>
        </div>
        <div className="form-group">
          <label>Graduation Status</label>
          <select
            name="graduationStatus"
            value={formData.graduationStatus}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="2024 Yaz dönemi sonunda mezun olacağım">2024 Yaz dönemi sonunda mezun olacağım</option>
            <option value="2024 Güz dönemi sonunda mezun olacağım">2024 Güz dönemi sonunda mezun olacağım</option>
            <option value="2025 Bahar dönemi sonunda mezun olacağım">2025 Bahar dönemi sonunda mezun olacağım</option>
            <option value="2025 Güz dönemi sonunda veya ilerki dönemlerde mezun olacağım">2025 Güz dönemi sonunda veya ilerki dönemlerde mezun olacağım</option>
            <option value="Bütün derslerimi tamamladım">Bütün derslerimi tamamladım</option>
            <option value=" Tek ders sınav hakkımı kullanıyorum"> Tek ders sınav hakkımı kullanıyorum</option>
          </select>
        </div>

        <h3>Company Information</h3>
        {[
          { label: "Company Name", name: "companyName", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Intern Department", name: "internDepartment", type: "text" },
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
          { label: "Internship Days", name: "internshipDays", type: "number" },
          { label: "Company Phone Number", name: "companyPhoneNumber", type: "tel" },
          { label: "Sector", name: "sector", type: "text" },
          { label: "Personnel Number", name: "personnelNumber", type: "number" },
          { label: "Department Personnel Number", name: "departmentPersonnelNumber", type: "number" },
          { label: "Department CENG Number", name: "departmentCENGNumber", type: "number" },
          { label: "Intern Advisor Full Name", name: "internAdvisorFullName", type: "text" },
          { label: "Intern Advisor Phone", name: "internAdvisorPhone", type: "tel" },
          { label: "Intern Advisor Mail", name: "internAdvisorMail", type: "email" },
          { label: "Internship Topic", name: "internshipTopic", type: "text" },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}

        <h3>Advisor and File</h3>
        <div className="form-group">
          <label>Select Advisor</label>
          <select
            name="advisor"
            value={formData.advisor}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Advisor --</option>
            {advisors.map((advisor) => (
              <option key={advisor.id} value={advisor.id}>
                {advisor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Upload Internship Documents (.pdf)</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} required />
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
