import React, { useState, useContext, useEffect } from 'react';
import CustomerContext from '../context/CustomerContext';
import axios from 'axios';

const CustomerForm = ({ existingCustomer, onSubmit }) => {
  const [pan, setPan] = useState(existingCustomer?.pan || '');
  const [fullName, setFullName] = useState(existingCustomer?.fullName || '');
  const [email, setEmail] = useState(existingCustomer?.email || '');
  const [mobile, setMobile] = useState(existingCustomer?.mobile || '');
  const [addresses, setAddresses] = useState(existingCustomer?.addresses || []);
  const [panValid, setPanValid] = useState(false);

  const { addCustomer, editCustomer } = useContext(CustomerContext);

  useEffect(() => {
    if (existingCustomer) {
      setPanValid(true);
    }
  }, [existingCustomer]);

  const handlePanChange = async (e) => {
    const panValue = e.target.value.toUpperCase();
    setPan(panValue);
    if (panValue.length === 10) {
      try {
        const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber: panValue });
        if (response.data.isValid) {
          setFullName(response.data.fullName);
          setPanValid(true);
        } else {
          setPanValid(false);
        }
      } catch (error) {
        console.error('Error verifying PAN:', error);
        setPanValid(false);
      }
    }
  };

  const handleAddAddress = () => {
    if (addresses.length < 10) {
      setAddresses([...addresses, { line1: '', line2: '', postcode: '', city: '', state: '' }]);
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const handlePostcodeChange = async (index, value) => {
    handleAddressChange(index, 'postcode', value);
    if (value.length === 6) {
      try {
        const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode: value });
        const newAddresses = [...addresses];
        newAddresses[index].city = response.data.city[0].name;
        newAddresses[index].state = response.data.state[0].name;
        setAddresses(newAddresses);
      } catch (error) {
        console.error('Error fetching postcode details:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customerData = { id: existingCustomer?.id || Date.now(), pan, fullName, email, mobile, addresses };
    if (existingCustomer) {
      editCustomer(customerData);
    } else {
      addCustomer(customerData);
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>PAN:</label>
        <input type="text" value={pan} onChange={handlePanChange} maxLength="10" required />
        {!panValid && pan.length === 10 && <span>Invalid PAN</span>}
      </div>
      <div>
        <label>Full Name:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength="140" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength="255" required />
      </div>
      <div>
        <label>Mobile:</label>
        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength="10" required />
      </div>
      <div>
        <button type="button" onClick={handleAddAddress}>Add Address</button>
      </div>
      {addresses.map((address, index) => (
        <div key={index}>
          <div>
            <label>Address Line 1:</label>
            <input type="text" value={address.line1} onChange={(e) => handleAddressChange(index, 'line1', e.target.value)} required />
          </div>
          <div>
            <label>Address Line 2:</label>
            <input type="text" value={address.line2} onChange={(e) => handleAddressChange(index, 'line2', e.target.value)} />
          </div>
          <div>
            <label>Postcode:</label>
            <input type="text" value={address.postcode} onChange={(e) => handlePostcodeChange(index, e.target.value)} maxLength="6" required />
          </div>
          <div>
            <label>City:</label>
            <select value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} required>
              <option value="" disabled>Select City</option>
              <option value={address.city}>{address.city}</option>
            </select>
          </div>
          <div>
            <label>State:</label>
            <select value={address.state} onChange={(e) => handleAddressChange(index, 'state', e.target.value)} required>
              <option value="" disabled>Select State</option>
              <option value={address.state}>{address.state}</option>
            </select>
          </div>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerForm;
