"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import ServicesData from "../data/ServicesLinks"; // your services data

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  const { data: session } = useSession();

  // Button styles for consistency
  const btnPrimary = "px-4 py-2 rounded-md text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors";

  return (
    <header className="w-full border-b border-red200 bg-white/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Left Section: Logo */}
        <div className="flex items-center cursor-pointer">
          <Link href="/" className="flex-shrink-0">
            <Image src="/newlogo.png" alt="GoZiply Logo" width={140} height={35} priority />
          </Link>
        </div>

        {/* Right Section: Nav, Auth buttons and Mobile Menu Toggle */}
        <div className="flex items-center gap-x-4">
          <nav className="hidden md:flex items-center gap-x-6">
            
            {/* Services Dropdown */}
            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
              <button
                onMouseEnter={() => setServicesOpen(true)}
                className="cursor-pointer flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Services <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {isServicesOpen && <ServicesDropdown />}
              </AnimatePresence>
            </div>

            {/* Auth Links / Profile Dropdown */}
            {session ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!isProfileOpen)} className="cursor-pointer h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700">
                  {session.user.firstName?.charAt(0)}
                </button>
                <AnimatePresence>
                  {isProfileOpen && <ProfileDropdown />}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Log in
                </Link>
                <Link href="/auth/signup" className={btnPrimary}>
                  Market yourself
                </Link>
                
                 {/* <Link href="/admin-panel" className={btnPrimary}>
                  Admin Panel
                </Link> */}
              </>
              
            )}
          </nav>

          <button
            className="cursor-pointer md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && <MobileMenu closeMenu={() => setMobileMenuOpen(false)} session={session} />}
      </AnimatePresence>

    </header>
  );
}

// --- Sub-components for Dropdowns and Mobile Menu ---

const ServicesDropdown = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg border border-slate-200"
  >
    <ul className="py-2 max-h-72 overflow-y-auto">
      {ServicesData.map((service) => (
        <li key={service.id}>
          <Link href={service.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            {service.title}
          </Link>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ProfileDropdown = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border border-slate-200"
  >
    <ul className="py-2">
      <li><Link href="/account" className="cursor-pointer block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Account</Link></li>
      <li className="my-1 h-px bg-slate-200"></li>
      <li><button onClick={() => signOut()} className="cursor-pointer w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button></li>
    </ul>
  </motion.div>
);

// ✅ Mobile Menu with createPortal fix
const MobileMenu = ({ closeMenu, session }) => {
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);
  
  // State to ensure we're on the client before rendering the portal
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // The menu content
  const menuContent = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeMenu}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 p-6 flex flex-col"
      >
        <button onClick={closeMenu} className="cursor-pointer self-end mb-8"><X size={24} /></button>
        <div className="space-y-4">
          <div>
            <button onClick={() => setMobileServicesOpen(!isMobileServicesOpen)} className="cursor-pointer w-full flex justify-between items-center text-lg font-medium">
              Services <ChevronDown size={20} className={`transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMobileServicesOpen && (
              <div className="mt-2 pl-4 border-l-2 border-slate-200 max-h-48 overflow-y-auto">
                {ServicesData.map(service => (
                  <Link key={service.id} href={service.href} onClick={closeMenu} className="block py-2 text-slate-700">{service.title}</Link>
                ))}
              </div>
            )}
          </div>
           {session ? (
              <>
                <Link href="/dashboard" onClick={closeMenu} className="cursor-pointer block text-lg font-medium">Dashboard</Link>
                <Link href="/account" onClick={closeMenu} className="cursor-pointer block text-lg font-medium">Account</Link>
                <button onClick={() => signOut()} className="cursor-pointer block w-full text-left text-lg font-medium text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth" onClick={closeMenu} className="cursor-pointer block text-lg font-medium">Log in</Link>
                <Link href="/become-tasker" onClick={closeMenu} className="cursor-pointer block mt-6 text-center text-lg font-semibold py-2 rounded-md bg-slate-800 text-white">Market yourself</Link>
              </>
            )}
        </div>
      </motion.div>
    </>
  );

  // Use the portal to render the menu at the root of the document
  return isClient ? createPortal(menuContent, document.body) : null;
};