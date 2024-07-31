import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/add-customer" element={<CustomerFormWrapper />} />
        <Route path="/edit-customer/:id" element={<EditCustomerForm />} />
      </Routes>
    </Router>
  );
};

const CustomerFormWrapper = () => {
  const navigate = useNavigate();
  return <CustomerForm onSubmit={() => navigate('/')} />;
};

const EditCustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const customers = JSON.parse(localStorage.getItem('customers')) || [];
  const customer = customers.find(c => c.id === Number(id));

  return <CustomerForm existingCustomer={customer} onSubmit={() => navigate('/')} />;
};

export default App;
