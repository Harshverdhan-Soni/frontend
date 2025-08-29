import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/classify", {
        method: "POST",
        body: formData,
      });
      console.log("Raw response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
     }
      
      const data = await response.json();
      console.log("Parsed data:", data);
      setResult(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>AI Document Classifier</h1>
      
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: '1rem', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
      />
      
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        {loading ? "Classifying..." : "Upload & Classify"}
      </button>

      {result && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <p style={{ margin: '8px 0' }}><strong>File:</strong> {result.filename}</p>
          <p style={{ margin: '8px 0' }}><strong>Text Extracted:</strong> {result.extracted}</p>
          <p style={{ margin: '8px 0' }}><strong>Detected Type:</strong> {result.type}</p>
        </div>
      )}
    </div>
  );
}
