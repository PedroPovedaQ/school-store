"use client";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  member: boolean;
}

interface MobileNavLink extends NavLink {
  closeMenu: () => void;
}

function NavLink({ url, text, member }: NavLink) {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1  dark:border-transparent ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
}

function MobileNavLink({ url, text, closeMenu }: MobileNavLink) {
  const path = usePathname();
  const handleClick = () => {
    closeMenu();
  };
  return (
    <a className="flex">
      <Link
        href={url}
        onClick={handleClick}
        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900 ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
        prefetch={url === "/logout" ? false : true}
      >
        {text}
      </Link>
    </a>
  );
}

export default function Navbar({
  links,
  logoUrl,
  logoText,
  isLoggedIn,
}: {
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
  isLoggedIn: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setIsLoggedIn] = useState(false);
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };
  const path = usePathname(); // Get the current path

  const supabase = createClient();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     if (user) {
  //       setIsLoggedIn(true);
  //     }
  //   };
  //   fetchUser();
  // }, []);
  return (
    <header
      className={`sticky top-0 z-10 py-2 w-full text-white ${
        path === "/" ? "bg-black bg-opacity-50" : "bg-custom-black"
      } `}
    >
      <div className="container flex justify-between px-0 mx-auto h-16 sm:px-6">
        <Logo src={logoUrl}>
          {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
        </Logo>

        <div className="hidden flex-shrink-0 items-center lg:flex">
          <ul className="hidden items-stretch space-x-3 lg:flex">
            {links.map(
              (item: NavLink) =>
                (item.member === isLoggedIn || item.member == false) && (
                  <NavLink key={item.id} {...item} />
                )
            )}
            {isLoggedIn ? (
              <Link href="/logout" prefetch={false}>
                <button className="px-8 py-2 text-sm font-bold text-black bg-green-500 hover:bg-green-600 rounded-full border-2 border-black transition duration-300 text-md hover:text-green focus:outline-none focus:ring-4 hover:shadow-lg hover:scale-105">
                  Sign Out
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="px-8 py-2 text-sm font-bold text-black bg-green-500 hover:bg-green-600 rounded-full border-2 border-black transition duration-300 text-md hover:text-green focus:outline-none focus:ring-4 hover:shadow-lg hover:scale-105">
                  Sign In
                </button>
              </Link>
            )}
          </ul>
        </div>

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" />{" "}
          {/* Overlay */}
          <Dialog.Panel className="overflow-y-auto fixed inset-y-0 z-50 px-6 py-6 w-full bg-gray-800 rtl:left-0 ltr:right-0 sm:max-w-sm sm:ring-1 sm:ring-inset sm:ring-white/10">
            <div className="flex justify-between items-center">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Strapi</span>
                {logoUrl && <img className="w-auto h-8" src={logoUrl} alt="" />}
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flow-root mt-6">
              <div className="-my-6 divide-y divide-gray-700">
                <div className="py-6 space-y-2">
                  {links.map((item) => (
                    <MobileNavLink
                      key={item.id}
                      closeMenu={closeMenu}
                      {...item}
                    />
                  ))}
                  {isLoggedIn ? (
                    <MobileNavLink
                      id={1}
                      closeMenu={closeMenu}
                      url="/logout"
                      text="Sign Out"
                      newTab={false}
                      member={false}
                    />
                  ) : (
                    <MobileNavLink
                      id={2}
                      closeMenu={closeMenu}
                      url="/login"
                      text="Sign In"
                      newTab={false}
                      member={false}
                    />
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>

        <button
          className="p-4 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="w-7 h-7 text-gray-100" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
