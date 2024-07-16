interface ProjectProps {
    id: string;
    name: string;
    description: string;
    features: string[];
    technologies: string[];
    githubLink: string;
    image: string;
}

const ProjectCard: React.FC<ProjectProps> = ({ name, description, features, technologies, githubLink, image }) => {
    return (
        <div className="border p-4 rounded">
            <img src={image} alt={`${name} screenshot`} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="mb-2">{description}</p>
            <ul className="mb-2">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <p><strong>Technologies:</strong> {technologies.join(', ')}</p>
            <a href={githubLink} target="_blank" rel="noopener noreferrer" className="btn">View on GitHub</a>
        </div>
    );
};

export default ProjectCard;
