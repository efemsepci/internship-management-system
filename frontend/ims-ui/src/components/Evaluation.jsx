import React, { useState } from 'react';
import axios from 'axios';
import '../style/evaluation.css';

const Evaluation = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [dropdownValue, setDropdownValue] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // PDF dosyasını seçme
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setIsFileUploaded(true);
    } else {
      alert('Lütfen bir PDF dosyası yükleyin.');
    }
  };

  // Dosyayı backend'e gönderme
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
      alert('Dosya başarıyla yüklendi!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      alert('Dosya yüklenirken bir hata oluştu.');
    }
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
        {isFileUploaded && (
          <p>Yüklenen PDF: {pdfFile.name}</p>
        )}
      </div>
      <div className='upload-button'>
        <button onClick={handleFileUpload} className="upload-button">
          Upload PDF
        </button>
        </div>
    </div>
    
  );
};

export default Evaluation;
