import React, { useState, useEffect } from 'react';
import DocumentsService from '../services/DocumentsService'; // Dökümanlarla ilgili API servisiniz
import '../style/documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    DocumentsService.getDocuments()
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching documents!', error);
      });
  }, []);

  const handleDeleteDocument = (documentId) => {
    DocumentsService.deleteDocument(documentId)
      .then(() => {
        setDocuments(documents.filter((doc) => doc.id !== documentId));
      })
      .catch((error) => {
        console.error('Error deleting document!', error);
      });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      DocumentsService.uploadDocument(selectedFile)
        .then(() => {
          setIsModalOpen(false);
          setSelectedFile(null);
          DocumentsService.getDocuments()
            .then((response) => {
              setDocuments(response.data);
            })
            .catch((error) => {
              console.error('Error fetching documents', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading document!', error);
        });
    } else {
      alert('Only PDF files are allowed!');
    }
  };

  const handleDownload = (documentId, fileName) => {
    DocumentsService.downloadDocument(documentId)
      .then((response) => {
        if (!response.data || response.data.size === 0) {
          throw new Error('Empty or invalid PDF response');
        }
  
        console.log('Content-Type:', response.headers['content-type']);
        if (response.headers['content-type'] !== 'application/pdf') {
          throw new Error('Invalid content type');
        }
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading document!', error);
      });
  };
  

  return (
    <div className="documents-container">
      <h2 className="documents-title">Documents</h2>
      <ul className="documents-list">
        {documents.map((document) => (
          <li key={document.id} className="document-item">
            <button
              onClick={() => handleDownload(document.id, document.fileName)}
              className="download-btn"
            >
              {document.fileName}
            </button>
            <button
              onClick={() => handleDeleteDocument(document.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setIsModalOpen(true)}
        className="add-document-btn"
      >
        Add Document
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload New Document</h3>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <div className="modal-buttons">
              <button className="modal-upload-btn" onClick={handleUpload}>
                Upload
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
