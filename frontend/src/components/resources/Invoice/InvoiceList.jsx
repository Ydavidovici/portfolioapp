import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoices, removeInvoice } from '../../../features/developerDashboard/developerDashboardSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Invoice } from '../../../features/developerDashboard/types';
import { Link } from 'react-router-dom';

const InvoiceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, loading, error } = useSelector((state: RootState) => state.developerDashboard);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch(removeInvoice(id));
    }
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (invoices.length === 0) return <p>No invoices found.</p>;

  return (
    <div className="invoice-list">
      <h2>Invoices</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/invoices/create">
          <button className="create-button">Add New Invoice</button>
        </Link>
      )}
      <ul>
        {invoices.map((invoice: Invoice) => (
          <li key={invoice.id} className="invoice-item">
            <h3>Invoice ID: {invoice.id}</h3>
            <p>Amount: {invoice.amount}</p>
            <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
            <div className="invoice-actions">
              <Link to={`/developer-dashboard/invoices/${invoice.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/invoices/edit/${invoice.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(invoice.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
