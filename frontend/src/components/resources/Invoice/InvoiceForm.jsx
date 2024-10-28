// src/components/resources/Invoice/InvoiceForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './InvoiceForm.css'; // Optional: For styling

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing invoice details if editing
  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        try {
          const response = await fetch(`/api/invoices/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch invoice details');
          }
          const data = await response.json();
          setInvoice(data);
          setAmount(data.amount);
          setDate(data.date);
          setCustomerName(data.customerName);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchInvoice();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        amount,
        date,
        customerName,
      };

      if (id) {
        // Editing existing invoice
        response = await fetch(`/api/invoices/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new invoice
        response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }

      // Redirect to invoices list after successful operation
      navigate('/developer-dashboard/invoices');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !invoice) return <p>Invoice not found.</p>;

  return (
    <div className="invoice-form">
      <h2>{id ? 'Edit Invoice' : 'Create Invoice'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="invoice-amount">Amount:</label>
          <input
            id="invoice-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="invoice-date">Date:</label>
          <input
            id="invoice-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="invoice-customer">Customer Name:</label>
          <input
            id="invoice-customer"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/invoices')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

InvoiceForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default InvoiceForm;
