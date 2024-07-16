// components/ProjectSection.tsx
const projects = [
  {
    id: '1',
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
    image: '/path/to/image1.png',
  },
  {
    id: '2',
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
    image: '/path/to/image2.png',
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
    image: '/path/to/image3.png',
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card border p-4 rounded shadow-lg"
            >
              <img
                src={project.image}
                alt={`${project.name} screenshot`}
                className="mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
              <p className="mb-2">{project.description}</p>
              <ul className="mb-2">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <p>
                <strong>Technologies:</strong> {project.technologies.join(', ')}
              </p>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                View on GitHub
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
