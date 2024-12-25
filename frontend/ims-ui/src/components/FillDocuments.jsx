import React, { useState, useEffect } from 'react';
import '../style/makeSubmission.css';
import DocumentsService from '../services/DocumentsService';
import SubmissionService from '../services/SubmissionService';
import UserService from '../services/UserService';
import HolidaysService from '../services/HolidaysService';

const FillDocuments = () => {
  const [formData, setFormData] = useState({
      stdName: "",
      stdSurname: "",
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
      internAdvisorJob:"",
      internAdvisorMail: "",
      internshipTopic: "",
      advisor: "",
    });

    const [advisors, setAdvisors] = useState([]);
    const [submissionCheck, setSubmissionCheck] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState(false); 
    const user = JSON.parse(sessionStorage.getItem("user"));

    const currentYear = new Date().getFullYear(); 
  
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
      HolidaysService.getHolidays()
            .then((response) => setHolidays(response.data))
            .catch((error) => console.error('Error fetching holidays!', error));
    }, [reload]);
  
    const calculateWorkDays = (start, end, holidays = []) => {
      let startDate = new Date(start);
      const endDate = new Date(end);
      let workDayCount = 0;
    
      const holidayDates = holidays.map((holiday) => {
        return { startDate: new Date(holiday.startDate), endDate: new Date(holiday.endDate) };
      });
    
      while (startDate <= endDate) {
        const dayOfWeek = startDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const isHoliday = holidayDates.some(
            (holiday) => startDate >= holiday.startDate && startDate <= holiday.endDate
          );
    
          if (!isHoliday) {
            workDayCount++;
          }
        }
        startDate.setDate(startDate.getDate() + 1);
      }
    
      console.log("work day: ", workDayCount);
      return workDayCount;
    };
    
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
  
      const calculatedWorkDays = calculateWorkDays(formData.startDate, formData.endDate, holidays);
  
      // Çalışma günlerinin doğruluğunu kontrol et
      if (calculatedWorkDays < 20) {
          alert("The work days between the start date and end date must be at least 20 days!");
          return;
      }
  
      if (parseInt(formData.internshipDays) < 20) {
          alert("Entered work days must be at least 20 days!");
          return;
      }
  
      if (parseInt(formData.internshipDays) !== calculatedWorkDays) {
          alert("Entered work days must be equal to the calculated work days!");
          return;
      }
  
      try {
          // Kullanıcının daha önce gönderim yapıp yapmadığını kontrol et
          if (submissionCheck.length > 0) {
              alert("You have already submitted!");
              setReload((prev) => !prev);
              return;
          }
  
          // Yeni bir gönderim oluştur
          const submissionResponse = await SubmissionService.createSubmission(
              user.id,
              formData.advisor,
              { ...formData }
          );
  
          console.log("Submission data sent successfully:", submissionResponse.data);
          alert("Submission information sent!");
          setReload((prev) => !prev);
      } catch (error) {
          console.error("Error during submission or document generation:", error);
          alert("An error occurred. Please try again.");
      }
  };

  const handleDownloadDocuments = async (e) => {
    const submissions = await SubmissionService.getSubmissionsBySender(user.id);
    if (submissions && submissions.data.length > 0) {
        const submissionId = submissions.data[0].id; 
        const response = await DocumentsService.generateDocuments(submissionId);
        if (response && response.data) {
            const blob = new Blob([response.data], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "forms.zip"; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("File downloaded successfully!");
        } else {
            console.error("Failed to generate documents or no data received.");
            alert("Fill form first!");
            return;
        }
    }
  }
  
  
    return (
      <div className="form-container">
        <h2 className="forms-title">Internship Submission Form</h2>
        <form onSubmit={handleSubmit} className="custom-form">
          <h3>Student Information</h3>
          {[
            { label: "Name", name: "stdName", type: "text" },
            { label: "Surname", name: "stdSurname", type: "text"},
            { label: "Student ID", name: "stdId", type: "text" },
            { label: "Phone Number", name: "phoneNumber", type: "tel" },
            { label: "Birth Place and Date", name: "birthPlaceDate", type: "text" },
            { label: "Department", name: "department", type: "text" },
            { label: "Completed Credit", name: "completedCredit", type: "number" },
            { label: "GPA", name: "gpa", type: "number", step: "0.01" },
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
              <option value="1">{currentYear} Yaz dönemi sonunda mezun olacağım</option>
              <option value="2">{currentYear} Güz dönemi sonunda mezun olacağım</option>
              <option value="3">{currentYear + 1} Bahar dönemi sonunda mezun olacağım</option>
              <option value="4">{currentYear + 1}  Güz dönemi sonunda veya ilerki dönemlerde mezun olacağım</option>
              <option value="5">Bütün derslerimi tamamladım</option>
              <option value="6"> Tek ders sınav hakkımı kullanıyorum</option>
            </select>
          </div>
          <div className="form-group">
            <label>Summer School</label>
            <select
              name="summerSchool"
              value={formData.summerSchool}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Option --</option>
              <option value="Yes">Ders Alacağım</option>
              <option value="No">Ders Almayacağım</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input  name= "description" type= "text" value={formData.description} onChange={handleInputChange}></input>
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
            { label: "Intern Advisor Job", name: "internAdvisorJob", type: "text"},
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
  
          <h3>Advisor</h3>
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
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <div>
          <button type="submit" className='submit-btn' onClick = {handleDownloadDocuments}> Download Documents</button>
        </div>
      </div>
    );
};

export default FillDocuments;
