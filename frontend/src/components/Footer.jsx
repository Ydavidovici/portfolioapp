// src/commonComponents/common/Footer.jsx
import React from 'react';
import Button from './Button';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="px-24 py-14 bg-dark rounded-tl-45px rounded-tr-45px flex flex-col gap-12">
      {/* Company Information */}
      <div className="flex flex-col gap-10">
        <h2 className="text-xl font-medium text-white bg-primary px-2 py-1 rounded-7px">
          Contact us:
        </h2>
        <div className="flex flex-col gap-5">
          <p className="text-lg font-normal text-white">
            Email: info@positivus.com
          </p>
          <p className="text-lg font-normal text-white">Phone: 555-567-8901</p>
          <p className="text-lg font-normal text-white">
            Address: 1234 Main St
            <br />
            Moonstone City, Stardust State 12345
          </p>
        </div>
      </div>

      {/* Navigation and Contacts */}
      <div className="flex justify-between items-start">
        {/* Navigation Links */}
        <div className="flex flex-col gap-6">
          <div className="text-lg font-normal text-white">
            Davidovici Software
          </div>
          <ul className="flex space-x-10">
            <li>
              <a href="#" className="text-lg font-normal text-white underline">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="text-lg font-normal text-white underline">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="text-lg font-normal text-white underline">
                Use Cases
              </a>
            </li>
            <li>
              <a href="#" className="text-lg font-normal text-white underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="text-lg font-normal text-white underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons and Legal Links */}
        <div className="flex flex-col gap-5">
          {/* Social Icons */}
          <div className="flex gap-5">
            <Icon
              src="/icons/facebook.svg"
              alt="Facebook"
              className="w-7 h-7 bg-white rounded-full p-1"
            />
            <Icon
              src="/icons/twitter.svg"
              alt="Twitter"
              className="w-7 h-7 bg-white rounded-full p-1"
            />
          </div>

          {/* Legal Links */}
          <div className="flex gap-10">
            <p className="text-lg font-normal text-white">
              © 2023 Davidovici Software All Rights Reserved.
            </p>
            <a href="#" className="text-lg font-normal text-white underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      {/* Subscription Block */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-8 py-5 bg-gray-800 rounded-14px border border-white focus:ring-2 focus:ring-primary"
          />
          <Button variant="primary">Subscribe to news</Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
