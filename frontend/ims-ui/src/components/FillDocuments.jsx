import React, { useState, useEffect } from 'react';
import '../style/documents.css';
import DocumentsService from '../services/DocumentsService';

const FillDocuments = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    DocumentsService.getDocuments()
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching documents!', error);
      });
  }, []);

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
  
        const blob = new Blob([response.data]);
        console.log('PDF Boyutu (byte):', blob.size);
        if (blob.size === 0) {
          throw new Error('Downloaded PDF is empty');
        }
  
        const url = window.URL.createObjectURL(blob);
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
      <h2 className="documents-title">Available Documents</h2>
      <ul className="documents-list">
        {documents.map((document) => (
          <li key={document.id} className="document-item">
            <button
              onClick={() => handleDownload(document.id, document.fileName)}
              className="download-btn"
            >
              {document.fileName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FillDocuments;
