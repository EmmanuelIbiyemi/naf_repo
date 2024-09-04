const Header = () => {
  return (
    <header>
      <NavLinks links={["abc", "def"]} />
    </header>
  );
};

const NavLinks = ({ links }: { links: string[] }) => {
  return links.map((link) => <p key={link}>link</p>);
};

export default Header;
