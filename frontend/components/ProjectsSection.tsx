import React from 'react';
import ProjectCard from './ProjectCard';

const projects = [
  {
    id: '1',
    name: 'Project Zechus Avos',
    description:
      'A website for a prominent Hasidic rabbi to list available chapters of books for sponsorships and dedications.',
    features: [
      'Stripe webhooks',
      'RESTful Node.js APIs',
      'Data validation and formatting',
    ],
    technologies: ['Node.js', 'Stripe', 'Express.js'],
    githubLink: 'https://github.com/Ydavidovici/Project-Zechus-Avos',
    liveLink: 'https://projectzechusavos.org',
  },
  {
    id: '2',
    name: 'Zeev-Jewelry E-commerce Store',
    description:
      'A luxury jewelry e-commerce store using MVC architecture with Next.js and Laravel.',
    features: [
      'User authentication',
      'Product listing',
      'Stripe integration',
      'Shopping cart',
      'Order management',
    ],
    technologies: ['Next.js', 'Laravel', 'MySQL'],
    githubLink: 'https://github.com/Ydavidovici/Zeev-Jewelry',
    liveLink: 'https://zeevjewelry.com',
  },
  {
    id: '3',
    name: "Kehilas Lev V'Nefesh Website",
    description:
      'A website for a synagogue to display prayer times, announcements, and static information.',
    features: [
      'CRUD operations for minyanim times',
      'File handling for minyan sheets',
      'HTTPS and Stripe for data security',
    ],
    technologies: ['Node.js', 'PostgreSQL', 'Heroku'],
    githubLink: 'https://github.com/Ydavidovici/KehilasLevVnefesh-Website',
    liveLink: 'https://khallevvnefesh.org',
  },
  {
    id: '4',
    name: 'Chess Engine',
    description:
      'A chess engine built with C++, Django, React, and PostgreSQL.',
    features: ['Can play against other bots online', 'Potential ELO of 3000'],
    technologies: ['C++', 'Django', 'React', 'PostgreSQL'],
    githubLink: 'https://github.com/Ydavidovici/Chess-Engine',
    liveLink: '',
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              features={project.features}
              technologies={project.technologies}
              githubLink={project.githubLink}
              liveLink={project.liveLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
