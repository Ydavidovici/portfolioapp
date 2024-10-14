import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInvoice, editInvoice, getInvoices } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Invoice } from '../../../features/developerDashboard/types';
import { useHistory, useParams } from 'react-router-dom';

interface RouteParams {
  id?: string;
}

const InvoiceForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const { invoices, error } = useSelector((state: RootState) => state.developerDashboard);

  const existingInvoice = invoices.find((inv) => inv.id === id);

  const [amount, setAmount] = useState(existingInvoice ? existingInvoice.amount : 0);
  const [date, setDate] = useState(existingInvoice ? existingInvoice.date : '');

  useEffect(() => {
    if (!existingInvoice && id) {
      dispatch(getInvoices());
    }
  }, [dispatch, existingInvoice, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && existingInvoice) {
      await dispatch(
        editInvoice({
          ...existingInvoice,
          amount,
          date,
        })
      );
    } else {
      await dispatch(
        addInvoice({
          amount,
          date,
        })
      );
    }
    history.push('/developer-dashboard/invoices');
  };

  return (
    <div className="invoice-form">
      <h2>{id ? 'Edit Invoice' : 'Create Invoice'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} required />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button type="submit">{id ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => history.push('/developer-dashboard/invoices')}>
            Cancel
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default InvoiceForm;
