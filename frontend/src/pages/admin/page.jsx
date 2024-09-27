import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminPage = () => {
  const [data, setData] = useState(null); // State to hold the user data
  const [error, setError] = useState(null); // State to handle any errors
  const token = useSelector((state) => state.misc.token);

  const showUserDetails = async () => {
    try {
      // Fetch data from the backend
      const response = await fetch("http://localhost:3000/admin/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.token, // Assuming 'tok' contains the token
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        console.log(fetchedData);
        setData({
          type: 'user',
          details: fetchedData, // Update state with fetched data
        });
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An error occurred while fetching user data");
    }
  };

  const showContainerDetails = async () => {
    try {
      // Fetch data from the backend
      const response = await fetch("http://localhost:3000/admin/getAllContainers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.token, // Assuming 'tok' contains the token
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        console.log(fetchedData);
        setData({
          type: 'container',
          details: fetchedData, // Update state with fetched data
        });
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An error occurred while fetching user data");
    }
  }

  const showLoginDetails = async () => {
    try {
      // Fetch data from the backend
      const response = await fetch("http://localhost:3000/admin/getAllAuth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.token, // Assuming 'tok' contains the token
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        console.log(fetchedData);
        setData({
          type: 'login',
          details: fetchedData, // Update state with fetched data
        });
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An error occurred while fetching user data");
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Admin Page</h1>
      <div>
        <button onClick={showUserDetails} style={buttonStyle}>
          Show User Details
        </button>
        <button onClick={showContainerDetails} style={buttonStyle}>
          Show Container Details
        </button>
        <button onClick={showLoginDetails} style={buttonStyle}>
          Show Login Details
        </button>
      </div>

      {/* Display any errors */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display the user data in a table */}
      <div style={{ marginTop: '20px' }}>
        {data && data.type === 'user' && (
          <div>
            <h2>Showing User Details</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {Object.keys(data.details[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.details.map((item) => (
                  <tr key={item.id}>
                    {Object.values(item).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Display the container data in a table */}
      <div style={{ marginTop: '20px' }}>
        {data && data.type === 'container' && (
          <div>
            <h2>Showing Container Details</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {Object.keys(data.details[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.details.map((item) => (
                  <tr key={item.id}>
                    {Object.values(item).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      {/* Display the login data in a table */}
      <div style={{ marginTop: '20px' }}>
        {data && data.type === 'login' && (
          <div>
            <h2>Showing Login Details</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {Object.keys(data.details[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.details.map((item) => (
                  <tr key={item.id}>
                    {Object.values(item).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const tableStyle = {
  margin: '0 auto',
  borderCollapse: 'collapse',
  width: '80%',
  border: '1px solid #ddd',
};

export default AdminPage;
