import React, { useState } from 'react';

const GetQuoteSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to your backend or a service like Formspree)
    console.log('Form submitted:', formData);
  };

  return (
    <section id="get-quote" className="get-quote-section">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Get a Quote</h2>
        <form onSubmit={handleSubmit} className="quote-form">
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
              className="w-full border p-2 rounded"
              required
            />
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
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">
              Project Details
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn bg-jet-highlight text-white px-4 py-2 rounded hover:bg-jet-accent transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default GetQuoteSection;
