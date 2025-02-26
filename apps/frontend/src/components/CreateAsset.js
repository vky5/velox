import React, { useState } from 'react';

const CreateAsset = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    gpsId: ''
  });
  const [error, setError] = useState(null);

  // Updated valid asset types to match backend
  const assetTypes = ['Machinery', 'Equipment', 'Package'];

  const validateGpsId = async (gpsId) => {
    try {
      const response = await fetch(`/api/v1/gps/validate/${gpsId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data.status === 'success';
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validation
    if (!formData.gpsId) {
      setError('GPS ID is required');
      return;
    }

    // Validate GPS ID
    const isValidGps = await validateGpsId(formData.gpsId);
    if (!isValidGps) {
      setError('Invalid GPS ID. Please check the ID and try again.');
      return;
    }

    if (!assetTypes.includes(formData.type)) {
      setError(`Asset type must be one of: ${assetTypes.join(', ')}`);
      return;
    }

    try {
      const response = await fetch('/api/v1/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'error') {
        // Handle validation errors from backend
        if (data.message.includes('validation failed')) {
          const errorMessage = data.message
            .replace('Asset validation failed:', '')
            .split(',')
            .map(err => err.trim())
            .join('\n');
          setError(errorMessage);
        } else {
          setError(data.message);
        }
      } else {
        // Success handling
        alert('Asset created successfully!');
        // Reset form or redirect
        setFormData({ name: '', type: '', gpsId: '' });
      }
    } catch (err) {
      setError('Failed to create asset. Please try again.');
    }
  };

  return (
    <div className="create-asset-form">
      <h2>Create New Asset</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Asset Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Asset Type:</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            required
          >
            <option value="">Select Type</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gpsId">GPS ID:</label>
          <input
            type="text"
            id="gpsId"
            value={formData.gpsId}
            onChange={(e) => setFormData({...formData, gpsId: e.target.value})}
            required
          />
        </div>

        <button type="submit">Create Asset</button>
      </form>
    </div>
  );
};

export default CreateAsset; 