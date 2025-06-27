import React from 'react';

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  date: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ studentName, courseName, date }) => {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        padding: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: '20px solid #4a90e2',
      }}
    >
      <div>
        <h1 style={{ fontSize: '72px', margin: 0, fontWeight: 'bold', color: '#4a90e2' }}>
          CERTIFICATE OF COMPLETION
        </h1>
        <p style={{ fontSize: '36px', marginTop: '20px' }}>This certificate is proudly presented to</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '96px', margin: 0, fontWeight: 'bold', color: '#333' }}>
          {studentName}
        </h2>
      </div>

      <div>
        <p style={{ fontSize: '36px', margin: 0 }}>
          For successfully completing the course
        </p>
        <h3 style={{ fontSize: '60px', margin: '10px 0', fontWeight: 'bold', color: '#4a90e2' }}>
          {courseName}
        </h3>
        <p style={{ fontSize: '28px' }}>Awarded on: {date}</p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
