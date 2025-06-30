import React from 'react';

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  date: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ studentName, courseName, date }) => {
  return (
    <div
      className="w-[1200px] h-[630px] p-20 flex flex-col justify-between font-sans bg-background text-foreground border-[20px] border-solid border-primary"
    >
      <div>
        <h1 className="text-[72px] m-0 font-bold text-primary">
          CERTIFICATE OF COMPLETION
        </h1>
        <p className="text-[36px] mt-5">This certificate is proudly presented to</p>
      </div>
      
      <div className="text-center">
        <h2 className="text-[96px] m-0 font-bold text-foreground">
          {studentName}
        </h2>
      </div>

      <div>
        <p className="text-[36px] m-0">
          For successfully completing the course
        </p>
        <h3 className="text-[60px] my-2 font-bold text-primary">
          {courseName}
        </h3>
        <p className="text-[28px]">Awarded on: {date}</p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
