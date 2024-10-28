// src/components/resources/Payment/PaymentForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './PaymentForm.css'; // Optional: For styling

const PaymentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [payment, setPayment] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [payerName, setPayerName] = useState('');
  const [loading, setLoading] = useState(!!id); // Only loading if editing
  const [error, setError] = useState(null);

  const userRole = user?.role;

  // Fetch existing payment details if editing
  useEffect(() => {
    if (id) {
      const fetchPayment = async () => {
        try {
          const response = await fetch(`/api/payments/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch payment details');
          }
          const data = await response.json();
          setPayment(data);
          setAmount(data.amount);
          setDate(data.date);
          setPayerName(data.payerName);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPayment();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        amount: parseFloat(amount),
        date,
        payerName,
      };

      if (id) {
        // Editing existing payment
        response = await fetch(`/api/payments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Creating new payment
        response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            createdAt: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save payment');
      }

      // Redirect to payments list after successful operation
      navigate('/developer-dashboard/payments');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || userLoading) return <p>Loading form...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (id && !payment) return <p>Payment not found.</p>;

  return (
    <div className="payment-form">
      <h2>{id ? 'Edit Payment' : 'Create Payment'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="payment-amount">Amount:</label>
          <input
            id="payment-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment-date">Date:</label>
          <input
            id="payment-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment-payer">Payer Name:</label>
          <input
            id="payment-payer"
            type="text"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            required
          />
        </div>
        {/* Add more form fields as necessary */}
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button
            type="button"
            onClick={() => navigate('/developer-dashboard/payments')}
          >
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

PaymentForm.propTypes = {
  // Define prop types if props are expected in the future
};

export default PaymentForm;
