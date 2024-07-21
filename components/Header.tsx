import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-jet-light p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Davidovici Software</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="#hero" legacyBehavior>
                <a className="text-jet-highlight hover:text-jet-accent">Home</a>
              </Link>
            </li>
            <li>
              <Link href="#about" legacyBehavior>
                <a className="text-jet-highlight hover:text-jet-accent">About</a>
              </Link>
            </li>
            <li>
              <Link href="#services" legacyBehavior>
                <a className="text-jet-highlight hover:text-jet-accent">Services</a>
              </Link>
            </li>
            <li>
              <Link href="#projects" legacyBehavior>
                <a className="text-jet-highlight hover:text-jet-accent">Projects</a>
              </Link>
            </li>
            <li>
              <Link href="#contact" legacyBehavior>
                <a className="text-jet-highlight hover:text-jet-accent">Contact</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
