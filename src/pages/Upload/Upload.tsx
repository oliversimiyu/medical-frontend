import { useState, type ChangeEvent } from 'react';
import { useStore } from '../../state/store';
import { parseCSVFile, validateFileType, validateFileSize, REQUIRED_CSV_COLUMNS } from '../../utils/csv';
import { mockClaimsService } from '../../services/mockServices';
import { toast } from 'react-toastify';
import './Upload.css';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const { uploadHistory, addUpload } = useStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file)) {
      toast.error('Invalid file type. Please upload a CSV file.');
      return;
    }

    if (!validateFileSize(file, 10)) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Validate CSV structure
      const { errors } = await parseCSVFile(selectedFile);
      
      if (errors.length > 0) {
        clearInterval(progressInterval);
        toast.error(`CSV validation failed: ${errors.join(', ')}`);
        setUploading(false);
        return;
      }

      // Simulate upload
      const result = await mockClaimsService.uploadClaims();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        addUpload({
          id: `UPL-${Date.now()}`,
          filename: selectedFile.name,
          uploadDate: new Date().toISOString(),
          recordCount: result.count,
          status: 'success',
        });
        toast.success(`Successfully uploaded ${result.count} claims!`);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(`Upload failed: ${result.errors.join(', ')}`);
        addUpload({
          id: `UPL-${Date.now()}`,
          filename: selectedFile.name,
          uploadDate: new Date().toISOString(),
          recordCount: 0,
          status: 'failed',
        });
      }
    } catch {
      toast.error('Upload failed due to an unexpected error.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      REQUIRED_CSV_COLUMNS.join(','),
      'CLM-2024-001,PAT-1234567,PRV-5678,2024-11-20,500.00,99213,Essential hypertension',
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-claims-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-page">
      <h1>Upload Claims Data</h1>

      <div className="upload-card">
        <h2>CSV File Upload</h2>
        <p className="upload-description">
          Upload a CSV file containing claims data. The file must include the following columns:
        </p>
        
        <div className="required-columns">
          <strong>Required Columns:</strong>
          <ul>
            {REQUIRED_CSV_COLUMNS.map((col) => (
              <li key={col}><code>{col}</code></li>
            ))}
          </ul>
        </div>

        <button onClick={downloadTemplate} className="btn-download">
          📥 Download Sample Template
        </button>

        <div className="file-input-container">
          <label htmlFor="file-input" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose CSV file...'}
          </label>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {selectedFile && (
          <div className="file-info">
            <p>📄 <strong>{selectedFile.name}</strong></p>
            <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="btn-primary btn-upload"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      <div className="upload-history-card">
        <h2>Upload History</h2>
        {uploadHistory.length === 0 ? (
          <p className="empty-state">No uploads yet</p>
        ) : (
          <>
          <div className="history-list">
            {uploadHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((upload) => (
              <div key={upload.id} className="history-item">
                <div className="history-icon">
                  {upload.status === 'success' ? '✅' : upload.status === 'failed' ? '❌' : '⏳'}
                </div>
                <div className="history-details">
                  <p className="history-filename">{upload.filename}</p>
                  <p className="history-meta">
                    {new Date(upload.uploadDate).toLocaleString()} • {upload.recordCount} records
                  </p>
                </div>
                <div className={`history-status status-${upload.status}`}>
                  {upload.status}
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="btn-secondary"
            >
              Previous
            </button>
            <span>Page {currentPage} of {Math.ceil(uploadHistory.length / itemsPerPage)}</span>
            <button
              disabled={currentPage >= Math.ceil(uploadHistory.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;
