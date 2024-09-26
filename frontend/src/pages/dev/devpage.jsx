import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const DevPage = () => {
  const [data, setData] = useState(null); // State to hold the template data
  const [error, setError] = useState(null); // State to handle any errors
  const [isFormVisible, setFormVisible] = useState(false); // State to toggle form visibility
  const [newTemplate, setNewTemplate] = useState({ name: '', image: '' }); // State for new template
  const token = useSelector((state) => state.misc.token);

  // Function to show template data
  const showTemplates = async () => {
    try {
      const response = await fetch("http://localhost:3000/dev/getAllTemplates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.token,
        },
      });
      if (response.ok) {
        const fetchedData = await response.json();
        // setData(fetchedData);
        setData({
            type: 'template',
            details: fetchedData,
        });
      } else {
        setError("Failed to fetch templates");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError("An error occurred while fetching templates");
    }
  };

  // Function to handle form submission for creating a new template
  const handleCreateTemplate = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await fetch("http://localhost:3000/dev/addNewTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.token,
        },
        body: JSON.stringify(newTemplate),
      });
    //   console.log(response.ok);    
      if (response.ok) {
        //   console.log("xyz");
        // const createdTemplate = await response.json();
        alert('Template created successfully');
        setNewTemplate({ name: '', image: '' }); // Clear form
        setFormVisible(false); // Hide form after submission
      } else {
        setError("Failed to create template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      setError("An error occurred while creating the template");
    }
  };

  // Function to handle input changes in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dev Page</h1>

      {/* Button to fetch and show templates */}
      <div>
        <button onClick={showTemplates} style={buttonStyle}>
          Show Templates
        </button>

        {/* Button to toggle form visibility */}
        <button onClick={() => setFormVisible(!isFormVisible)} style={buttonStyle}>
          Create New Template
        </button>
      </div>

      {/* Display the user data in a table */}
      <div style={{ marginTop: '20px' }}>
        {data && data.type === 'template' && (
          <div>
            <h2>Showing Tamplate Details</h2>
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

      {/* Form to create a new template */}
      {isFormVisible && (
        <div style={formStyle}>
          <h2>Create New Template</h2>
          <form onSubmit={handleCreateTemplate}>
            <div>
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTemplate.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="image">Image Name: </label>
              <input
                type="text"
                id="image"
                name="image"
                value={newTemplate.image}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" style={createButtonStyle}>
              Create Template
            </button>
          </form>
        </div>
      )}
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
  
  const formContainerStyle = {
    marginTop: '20px',
    backgroundColor: '#f0f0f0',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    width: '60%',
    margin: '0 auto',
  };
  
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };
  
  const formFieldStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };
  
  const labelStyle = {
    flex: '1',
    textAlign: 'right',
    marginRight: '10px',
    fontWeight: 'bold',
  };
  
  const inputStyle = {
    flex: '2',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  };
  
  const createButtonStyle = {
    padding: '12px 20px',
    marginTop: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  
export default DevPage;
