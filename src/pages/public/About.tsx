import React from 'react';

const About: React.FC = () => {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/80 backdrop-blur shadow-elev-1 p-6">
      <h1 className="text-2xl font-extrabold text-gray-900">About AluVerse</h1>
      <p className="mt-2 text-gray-600">
        AluVerse is an alumni platform for sharing blogs, discovering events, finding internships, and supporting student startups.
      </p>
    </div>
  );
};

export default About;
