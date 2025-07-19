"use client";

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const socialLinks = [
    { icon: <FaLinkedin />, href: 'https://linkedin.com/in/dnsouzadev', name: 'LinkedIn' },
    { icon: <FaGithub />, href: 'https://github.com/dnsouzadev', name: 'GitHub' },
    { icon: <FaTwitter />, href: 'https://twitter.com/dnsouzadev', name: 'X' },
  ];

  return (
    <footer className="w-full mt-16 mb-8 text-center text-white">
      <div className="flex items-center justify-center space-x-4 mb-2">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            {link.icon}
          </a>
        ))}
      </div>
      <p className="text-sm text-gray-400">
        Desenvolvido com ❤️ por Daniel Souza
      </p>
    </footer>
  );
}
