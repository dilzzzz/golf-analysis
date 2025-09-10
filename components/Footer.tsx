import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    { name: 'Overview', href: 'https://golfai.one/' },
    { name: 'Blog', href: 'https://golfai.one/blog/' },
    { name: 'Privacy Policy', href: 'https://golfai.one/privacy-policy/' },
    { name: 'Terms & Conditions', href: 'https://golfai.one/terms-conditions/' },
    { name: 'Disclaimer', href: 'https://golfai.one/disclaimer/' },
    { name: 'Contact us', href: 'https://golfai.one/contact-us/' },
    { name: 'About Us', href: 'https://golfai.one/about-us/' },
  ];

  return (
    <footer className="bg-[#2d3240] border-t border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;