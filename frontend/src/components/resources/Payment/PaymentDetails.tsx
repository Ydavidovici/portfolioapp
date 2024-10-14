// src/components/resources/Payment/PaymentDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPayments } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Payment } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';

interface RouteParams {
  id: string;
}

const PaymentDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector((state: RootState) => state.developerDashboard);

  const payment: Payment | undefined = payments.find((payment) => payment.id === id);

  useEffect(() => {
    if (!payment) {
      dispatch(getPayments());
    }
  }, [dispatch, payment]);

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!payment) return <p>Payment not found.</p>;

  return (
    <div>
      <h2>Payment #{payment.id}</h2>
      <p><strong>Amount:</strong> ${payment.amount}</p>
      <p><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</p>
      <Link to="/developer-dashboard/payments">
        <button>Back to Payments</button>
      </Link>
    </div>
  );
};

export default PaymentDetails;
