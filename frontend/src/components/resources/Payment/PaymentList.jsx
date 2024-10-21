// src/components/resources/Payment/PaymentList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, removePayment } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Payment } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';

const PaymentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector((state: RootState) => state.developerDashboard);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    dispatch(getPayments());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      dispatch(removePayment(id));
    }
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error: {error}</p>;
  if (payments.length === 0) return <p>No payments found.</p>;

  return (
    <div>
      <h2>Payments</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/payments/create">
          <button>Add New Payment</button>
        </Link>
      )}
      <ul>
        {payments.map((payment: Payment) => (
          <li key={payment.id}>
            <h3>Payment #{payment.id}</h3>
            <p>Amount: ${payment.amount}</p>
            <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
            <div>
              <Link to={`/developer-dashboard/payments/${payment.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/payments/edit/${payment.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(payment.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentList;
