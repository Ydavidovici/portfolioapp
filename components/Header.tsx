const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white py-4 fixed w-full top-0 z-50">
      <nav className="container mx-auto flex justify-between">
        <div className="text-lg font-bold">Davidovici Software</div>
        <ul className="flex space-x-4">
          <li><a href="#hero">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
