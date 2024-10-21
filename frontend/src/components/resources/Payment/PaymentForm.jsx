// src/components/resources/Payment/PaymentForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPayment, editPayment, getPayments } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Payment } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';

interface RouteParams {
  id?: string;
}

const PaymentForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const { payments, error } = useSelector((state: RootState) => state.developerDashboard);
  const existingPayment = payments.find((payment) => payment.id === id);

  const [amount, setAmount] = useState(existingPayment ? existingPayment.amount : '');
  const [date, setDate] = useState(existingPayment ? existingPayment.date : '');

  useEffect(() => {
    if (!existingPayment && id) {
      dispatch(getPayments());
    }
  }, [dispatch, existingPayment, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && existingPayment) {
      await dispatch(editPayment({ ...existingPayment, amount, date }));
    } else {
      await dispatch(addPayment({ amount, date }));
    }
    history.push('/developer-dashboard/payments');
  };

  return (
    <div>
      <h2>{id ? 'Edit Payment' : 'Create Payment'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => history.push('/developer-dashboard/payments')}>
            Cancel
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
