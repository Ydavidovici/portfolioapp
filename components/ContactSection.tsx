// components/ContactSection.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }
    if (formData.message.trim() === '') {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      window.location.href = `mailto:Yaakov@davidovicisoftware.com?subject=Contact%20Form&body=Name:%20${formData.name}%0AEmail:%20${formData.email}%0AMessage:%20${formData.message}`;
    }
  };

  const { isInView, setRef } = useInView(0.1);

  return (
    <section id="contact" className="contact-section">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
          transition={{ duration: 0.5 }}
          ref={setRef}
        >
          Contact Us
        </motion.h2>
        <motion.form
          onSubmit={handleSubmit}
          className="contact-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-black"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-black"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-black"
              required
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn bg-jet-highlight text-white px-4 py-2 rounded hover:bg-jet-accent transition"
          >
            Send
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
