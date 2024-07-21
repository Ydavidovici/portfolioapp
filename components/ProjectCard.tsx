import React from 'react';
import Image from 'next/image';

interface ProjectProps {
  id: string;
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  githubLink: string;
  liveLink: string;
  image: string;
}

const ProjectCard: React.FC<ProjectProps> = ({
  name,
  description,
  features,
  technologies,
  githubLink,
  liveLink,
  image,
}) => {
  return (
    <div className="custom-border">
      <Image
        src={image}
        alt={`${name} screenshot`}
        className="mb-4"
        width={500}
        height={300}
      />
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="mb-2">{description}</p>
      <ul className="mb-2">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <p className="mb-2">
        <strong>Technologies:</strong> {technologies.join(', ')}
      </p>
      <div className="custom-mt-auto custom-flex">
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="custom-btn custom-bg-blue-500 hover:custom-bg-blue-600 transition"
        >
          View on GitHub
        </a>
        <a
          href={liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="custom-btn custom-bg-green-500 hover:custom-bg-green-600 transition"
        >
          View Live
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
