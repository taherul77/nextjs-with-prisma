"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import classNames from "classnames";
import { AiFillBug } from "react-icons/ai";

const Navbar = () => {
  const currentPath = usePathname();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Issue", path: "/issues" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="flex space-x-6 mb-5 px-5 h-14 items-center">
      <Link href="/">
        {" "}
        <AiFillBug />{" "}
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <li
            key={link.path}
            className={classNames({
              "text-zinc-900": link.path === currentPath,
              "text-zinc-500": link.path !== currentPath,
              "hover:text-neutral-800 transition-colors": true,
            })}
          >
            <Link href={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
