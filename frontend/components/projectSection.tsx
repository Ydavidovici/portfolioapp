import ProjectCard from './ProjectCard';

const projects = [
    {
        id: '1',
        name: 'Zeev-Jewelry E-commerce Store',
        description: 'A luxury jewelry e-commerce store using MVC architecture with Next.js and Laravel.',
        features: ['User authentication', 'Product listing', 'Stripe integration', 'Shopping cart', 'Order management'],
        technologies: ['Next.js', 'Laravel', 'MySQL'],
        githubLink: 'https://github.com/Ydavidovici/Zeev-Jewelry',
        image: '/path/to/image1.png',
    },
    // Add other projects here...
];

const ProjectsSection: React.FC = () => {
    return (
        <section id="projects" className="py-8">
            <h2 className="text-3xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection;
