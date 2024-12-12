import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/evaluation.css';
import InternshipService from '../services/InternshipService';

const Evaluation = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setIsFileUploaded(true);
    } else {
      alert('Lütfen bir PDF dosyası yükleyin.');
    }
  };

  const handleFileUpload = async () => {
    if (!pdfFile) {
      alert('Lütfen önce bir PDF dosyası yükleyin.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      alert('Upload failed!');
    }
  };

  const handleDropdownChange = (id, dropdownName, value) => {
    setInternShips((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, [dropdownName]: value } : row
      )
    );
  };

  const handleButtonClick = (id) => {
    const internship = internships.find((item) => item.id === id);

    if (!internship) {
      alert('Invalid internship ID');
      return;
    }

    const { isEvaluationForm, isReport, grade } = internship;

    InternshipService.updateInternship(id, isEvaluationForm, isReport, grade)
      .then((response) => {
        console.log("Updated successfully", response);
        alert('Internship updated successfully!');
        setReload(!reload); // Refresh data after update
      })
      .catch((error) => {
        console.error('Error updating internship:', error);
        alert('Failed to update internship.');
      });
  };

  return (
    <div className="pdf-upload-container">
      <h2>Internship Evaluation</h2>
      <div className="pdf-upload">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {isFileUploaded && <p>Yüklenen PDF: {pdfFile.name}</p>}
      </div>
      <div className='upload-button'>
        <button onClick={handleFileUpload} className="upload-button">
          Upload PDF
        </button>
      </div>
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
                      handleDropdownChange(internship.id, 'isEvaluationForm', e.target.value)
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
                      handleDropdownChange(internship.id, 'isReport', e.target.value)
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
                      handleDropdownChange(internship.id, 'grade', e.target.value)
                    }
                  >
                    <option value="">-- Select --</option>
                    <option value="P">P</option>
                    <option value="I">I</option>
                    <option value="F">F</option>
                  </select>
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
    </div>
  );
};

export default Evaluation;
