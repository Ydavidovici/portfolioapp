// src/components/resources/Invoice/InvoiceList.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import useFetch from '../../../hooks/useFetch';
import PropTypes from 'prop-types';
// import './InvoiceList.css'; // Optional: For styling

const InvoiceList = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useContext(UserContext);
  const userRole = user?.role;

  const { data: invoices, loading, error } = useFetch('/api/invoices');
  const [invoiceList, setInvoiceList] = useState([]);

  // Update invoiceList when invoices data changes
  useEffect(() => {
    if (invoices) {
      setInvoiceList(invoices);
    }
  }, [invoices]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const response = await fetch(`/api/invoices/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete invoice');
        }
        // Remove the deleted invoice from local state to update UI
        setInvoiceList((prevInvoices) =>
          prevInvoices.filter((inv) => inv.id !== id)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading || userLoading) return <p>Loading invoices...</p>;
  if (error || userError)
    return <p className="error">Error: {error || userError}</p>;
  if (!invoiceList || invoiceList.length === 0)
    return <p>No invoices found.</p>;

  return (
    <div className="invoice-list">
      <h2>Invoices</h2>
      {(userRole === 'admin' || userRole === 'developer') && (
        <Link to="/developer-dashboard/invoices/create">
          <button className="create-button">Add New Invoice</button>
        </Link>
      )}
      <ul>
        {invoiceList.map((invoice) => (
          <li key={invoice.id} className="invoice-item">
            <h3>Invoice ID: {invoice.id}</h3>
            <p>
              <strong>Amount:</strong> ${invoice.amount.toFixed(2)}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(invoice.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Customer Name:</strong> {invoice.customerName}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
            {/* Display other invoice details as necessary */}
            <div className="invoice-actions">
              <Link to={`/developer-dashboard/invoices/${invoice.id}`}>
                <button>View Details</button>
              </Link>
              {(userRole === 'admin' || userRole === 'developer') && (
                <>
                  <Link to={`/developer-dashboard/invoices/edit/${invoice.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(invoice.id)}>
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

InvoiceList.propTypes = {
  // Define prop types if props are expected in the future
};

export default InvoiceList;
