import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInvoices } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Invoice } from '../../../features/developerDashboard/types';
import { useParams, Link } from 'react-router-dom';

interface RouteParams {
  id: string;
}

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, loading, error } = useSelector((state: RootState) => state.developerDashboard);

  const invoice: Invoice | undefined = invoices.find((inv) => inv.id === id);

  useEffect(() => {
    if (!invoice) {
      dispatch(getInvoices());
    }
  }, [dispatch, invoice]);

  if (loading) return <p>Loading invoice details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!invoice) return <p>Invoice not found.</p>;

  return (
    <div className="invoice-details">
      <h2>Invoice ID: {invoice.id}</h2>
      <p><strong>Amount:</strong> {invoice.amount}</p>
      <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
      <Link to="/developer-dashboard/invoices">
        <button>Back to Invoices</button>
      </Link>
    </div>
  );
};

export default InvoiceDetails;
