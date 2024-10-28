// src/components/resources/Invoice/InvoiceDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './InvoiceDetails.css'; // Optional: For styling

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoice details');
        }
        const data = await response.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const response = await fetch(`/api/invoices/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete invoice');
        }
        // Redirect to invoices list after deletion
        navigate('/developer-dashboard/invoices');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading invoice details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!invoice) return <p>Invoice not found.</p>;

  const { amount, date, createdAt, customerName } = invoice;
  const userRole = user?.role;

  return (
    <div className="invoice-details">
      <h2>Invoice ID: {invoice.id}</h2>
      <p>
        <strong>Amount:</strong> ${amount.toFixed(2)}
      </p>
      <p>
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      <p>
        <strong>Customer Name:</strong> {customerName}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      {/* Display other invoice details as necessary */}

      <div className="invoice-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/invoices/edit/${invoice.id}`}>
              <button>Edit Invoice</button>
            </Link>
            <button onClick={handleDelete}>Delete Invoice</button>
          </>
        )}
        <Link to="/developer-dashboard/invoices">
          <button>Back to Invoices</button>
        </Link>
      </div>
    </div>
  );
};

InvoiceDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default InvoiceDetails;
