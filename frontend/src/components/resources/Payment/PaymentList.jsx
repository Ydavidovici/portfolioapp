// src/components/resources/Payment/PaymentList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './PaymentList.css'; // Optional: For styling

const PaymentList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: payments, loading, error } = useFetch('/api/payments');
  const [paymentList, setPaymentList] = useState([]);

  // Update paymentList when payments data changes
  useEffect(() => {
    if (payments) {
      setPaymentList(payments);
    }
  }, [payments]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        const response = await fetch(`/api/payments/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete payment');
        }
        // Remove the deleted payment from local state to update UI
        setPaymentList((prevPayments) =>
          prevPayments.filter((pay) => pay.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading payments...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!paymentList || paymentList.length === 0)
    return <p>No payments found.</p>;

  return (
    <div className="payment-list">
      <h2>Payments</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/payments/create">
          <button className="create-button">Add New Payment</button>
        </Link>
      )}
      <ul>
        {paymentList.map((payment) => (
          <li key={payment.id} className="payment-item">
            <h3>Payment ID: {payment.id}</h3>
            <p>
              <strong>Amount:</strong> ${payment.amount.toFixed(2)}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(payment.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Payer Name:</strong> {payment.payerName}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(payment.createdAt).toLocaleDateString()}
            </p>
            {/* Display other payment details as necessary */}
            <div className="payment-actions">
              <Link to={`/developer-dashboard/payments/${payment.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/payments/edit/${payment.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(payment.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

PaymentList.propTypes = {
  // Define prop types if props are expected in the future
};

export default PaymentList;
