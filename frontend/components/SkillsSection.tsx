const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-8">
      <h2 className="text-3xl font-bold mb-4">Skills</h2>
      <ul>
        <li>Languages: JavaScript, PHP, Python, HTML, CSS, SQL</li>
        <li>
          Frameworks/Libraries: Node.js, Next.js, Laravel, Tailwind CSS, Django
        </li>
        <li>Databases: SQLite, MySQL, PostgreSQL</li>
        <li>Tools/Technologies: Docker, Git, Apache, PhpStorm, WebStorm</li>
        <li>
          Other: Project Management with Trello, Containerization, CI/CD
          Pipelines
        </li>
      </ul>
    </section>
  );
};

export default SkillsSection;
