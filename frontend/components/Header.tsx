// components/Header.tsx

import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="header py-4 fixed w-full top-0 z-50 bg-jet-light">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/DavidoviciSoftwareLogo.png"
            alt="Davidovici Software Logo"
            width={50}
            height={50}
          />
          <div className="text-lg font-bold ml-4">Davidovici Software</div>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="#hero" legacyBehavior>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="#about" legacyBehavior>
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="#services" legacyBehavior>
              <a>Services</a>
            </Link>
          </li>
          <li>
            <Link href="#projects" legacyBehavior>
              <a>Projects</a>
            </Link>
          </li>
          <li>
            <Link href="#contact" legacyBehavior>
              <a>Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
