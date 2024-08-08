import React from 'react';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';

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
    title: 'Web Scraping',
    description:
      'Extracting data from websites for various use cases, including market research and competitive analysis.',
  },
  {
    title: 'Data Science and Analytics',
    description:
      'Leveraging data to provide insights and drive decision-making through advanced analytics and machine learning.',
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
  {
    title: 'UI/UX Design',
    description:
      'Designing user-friendly interfaces and experiences that delight users and meet business goals.',
  },
  {
    title: 'Mobile App Development',
    description:
      'Creating high-quality mobile applications for iOS and Android platforms.',
  },
  {
    title: 'SEO Services',
    description:
      "Increasing your website's visibility on search engines, driving more traffic, and boosting sales through comprehensive SEO strategies.",
  },
  {
    title: 'Email Marketing Services',
    description:
      'Helping you connect with your audience, build relationships, and drive conversions through effective email marketing campaigns.',
  },
  {
    title: 'Maintenance and Support',
    description:
      'Providing ongoing maintenance and support to ensure your applications run smoothly and securely.',
  },
  {
    title: 'DevOps and Infrastructure Management',
    description:
      'Implementing and managing CI/CD pipelines, cloud infrastructure, and automation.',
  },
];

const ServicesSection: React.FC = () => {
  const { isInView, setRef } = useInView(0.1);

  return (
    <section id="services" className="services-section">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
          transition={{ duration: 0.5 }}
          ref={setRef}
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
