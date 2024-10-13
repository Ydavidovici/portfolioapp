// src/commonComponents/SectionHeader.jsx
import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <section className="flex flex-col md:flex-row items-start gap-10 px-24 py-16">
      <div className="bg-primary px-2 py-1 rounded-7px">
        <h2 className="text-4xl font-medium text-black font-sans">{title}</h2>
      </div>
      <p className="text-lg font-normal text-black font-sans max-w-lg">
        {subtitle}
      </p>
    </section>
  );
};

export default SectionHeader;
