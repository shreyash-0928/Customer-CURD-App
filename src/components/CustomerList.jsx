import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CustomerContext from '../context/CustomerContext';

const CustomerList = () => {
  const { customers, deleteCustomer } = useContext(CustomerContext);

  const handleDelete = (id) => {
    deleteCustomer(id);
  };

  return (
    <div>
      <h1>Customer List</h1>
      <Link to="/add-customer">Add Customer</Link>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <div>{customer.fullName}</div>
            <div>{customer.email}</div>
            <div>{customer.mobile}</div>
            <Link to={`/edit-customer/${customer.id}`}>Edit</Link>
            <button onClick={() => handleDelete(customer.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
