import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>
        <form
          action="https://formspree.io/f/{your-form-id}"
          method="POST"
          className="contact-form"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full border p-2 rounded"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn bg-jet-highlight text-white px-4 py-2 rounded hover:bg-jet-accent transition"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
