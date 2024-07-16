const ContactSection: React.FC = () => {
    return (
        <section id="contact" className="py-8">
            <h2 className="text-3xl font-bold mb-4">Contact</h2>
            <form action="https://formspree.io/f/{your-form-id}" method="POST" className="space-y-4">
                <div>
                    <label htmlFor="name" className="block">Name</label>
                    <input type="text" id="name" name="name" className="w-full border p-2" required />
                </div>
                <div>
                    <label htmlFor="email" className="block">Email</label>
                    <input type="email" id="email" name="email" className="w-full border p-2" required />
                </div>
                <div>
                    <label htmlFor="message" className="block">Message</label>
                    <textarea id="message" name="message" className="w-full border p-2" required></textarea>
                </div>
                <button type="submit" className="btn">Send</button>
            </form>
        </section>
    );
};

export default ContactSection;
