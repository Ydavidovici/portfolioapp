// src/components/resources/Payment/PaymentDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import PropTypes from 'prop-types';
// import './PaymentDetails.css'; // Optional: For styling

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment details
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`/api/payments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        setPayment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        const response = await fetch(`/api/payments/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete payment');
        }
        // Redirect to payments list after deletion
        navigate('/developer-dashboard/payments');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading payment details...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!payment) return <p>Payment not found.</p>;

  const { amount, date, createdAt, payerName } = payment;
  const userRole = user?.role;

  return (
    <div className="payment-details">
      <h2>Payment ID: {payment.id}</h2>
      <p>
        <strong>Amount:</strong> ${amount.toFixed(2)}
      </p>
      <p>
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      <p>
        <strong>Payer Name:</strong> {payerName}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      {/* Display other payment details as necessary */}

      <div className="payment-actions">
        {(userRole === 'admin' || userRole === 'developer') && (
          <>
            <Link to={`/developer-dashboard/payments/edit/${payment.id}`}>
              <button>Edit Payment</button>
            </Link>
            <button onClick={handleDelete}>Delete Payment</button>
          </>
        )}
        <Link to="/developer-dashboard/payments">
          <button>Back to Payments</button>
        </Link>
      </div>
    </div>
  );
};

PaymentDetails.propTypes = {
  // Define prop types if props are expected in the future
};

export default PaymentDetails;
