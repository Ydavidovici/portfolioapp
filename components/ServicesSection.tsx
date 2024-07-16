// components/ServicesSection.tsx
const services = [
  {
    title: 'Web Development',
    description:
      'Building responsive and interactive websites using the latest web technologies.',
  },
  {
    title: 'E-commerce Solutions',
    description:
      'Creating online stores with secure payment processing and easy-to-manage product listings.',
  },
  {
    title: 'API Development',
    description:
      'Developing RESTful and GraphQL APIs to power your web and mobile applications.',
  },
  {
    title: 'Consulting and Code Review',
    description:
      'Providing expert advice and code reviews to improve your existing projects.',
  },
  {
    title: 'Performance Optimization',
    description:
      'Optimizing the performance of your website to ensure fast load times and a smooth user experience.',
  },
  {
    title: 'Custom Software Development',
    description:
      'Developing custom software solutions tailored to your business needs.',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card border p-4 rounded shadow-lg text-center"
            >
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
