import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navigation = (props) => {
  //object that holds the latest auth object
  //this component will re-render when the context we are listening to changes
  const auth = useContext(AuthContext);

  const [navigationItems, setNavigationItems] = useState([
    { name: "events", href: "/events", current: false, index: 0 },
    { name: "about", href: "/", current: false, index: 1 },
    { name: "how it works", href: "/more", current: false, index: 2 },
  ]);

  const handleLinkClick = (index) => {
    const updatedItems = navigationItems.map((item, i) =>
      i === index ? { ...item, current: true } : { ...item, current: false }
    );
    setNavigationItems(updatedItems);
  };

  return (
    <Disclosure
      as="nav"
      className="bg-bright-yellow border-b-4 border-navy-blue"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start text-lg ms-4">
                <div className="flex flex-shrink-0 items-center">
                  <div className="logo-title me-2">
                    <Link className="no-underline text-navy-blue " to="/">
                      in real time
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigationItems.map((item) => (
                      <div
                        key={item.name}
                        className={classNames(
                          "rounded-md me-4 text-navy-blue hover-underline-animation",
                          item.current ? "bg-light-green" : ""
                        )}
                        aria-current={item.current ? "page" : undefined}
                        onClick={() => handleLinkClick(item.index)}
                      >
                        <NavLink className="no-underline" to={item.href}>
                          {item.name}
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {auth.isLoggedIn ? (
                  <button onClick={auth.logout}>
                    <FaUserCircle className="text-navy-blue text-3xl" />
                  </button>
                ) : (
                  <NavLink to="/auth">
                    {" "}
                    <FaRegCircleUser className="text-navy-blue text-3xl" />
                  </NavLink>
                )}
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <div className="flex space-x-4">
                    <Link to="/polls/new">
                        <button>+ new poll</button>
                    </Link>
                </div> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {/* <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      /> */}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-pink-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 flex flex-col px-2 pb-3 pt-2">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className={classNames("rounded-md me-4 text-navy-blue")}
                  aria-current={item.current ? "page" : undefined}
                  onClick={() => handleLinkClick(item.index)}
                >
                  <NavLink
                    className={classNames(
                      "no-underline hover-underline-animation",
                      item.current ? "bg-light-green" : ""
                    )}
                    to={item.href}
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}
              {/* {navigationItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-navy-blue"
                      : "text-navy-blue hover:bg-gray-700 hover:text-navy-blue",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))} */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navigation;
