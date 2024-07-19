import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="header py-4 fixed w-full top-0 z-50 bg-jet-light">
      <nav className="container mx-auto flex justify-between">
        <div className="text-lg font-bold">Davidovici Software</div>
        <ul className="flex space-x-4">
          <li><Link href="#hero"><a>Home</a></Link></li>
          <li><Link href="#about"><a>About</a></Link></li>
          <li><Link href="#services"><a>Services</a></Link></li>
          <li><Link href="#projects"><a>Projects</a></Link></li>
          <li><Link href="#contact"><a>Contact</a></Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
