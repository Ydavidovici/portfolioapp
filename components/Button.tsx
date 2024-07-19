import Link from 'next/link';

const Button: React.FC<{ href: string; text: string }> = ({ href, text }) => (
  <Link href={href} passHref>
    <a className="button px-4 py-2 rounded transition bg-blue-500 text-white hover:bg-blue-600">
      {text}
    </a>
  </Link>
);

export default Button;
