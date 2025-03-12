import React, { useState } from "react";

function BugReportForm(){
  const [bugType, setBugType] = useState("");
  const [message, setMessage] = useState("");

  const submitBugReport = () => {
    if (!bugType || !message.trim()) {
      alert("Please select a bug type and provide a message.");
      return;
    }

    const report = {
      type: bugType,
      message: message.trim(),
    };

    // console.log("Bug Report Submitted:", report);

    // Uncomment and configure API endpoint to send the report
    // fetch('/api/bug-report', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(report),
    // }).then(response => {
    //   if (response.ok) alert('Bug report submitted successfully!');
    //   else alert('Failed to submit the bug report.');
    // });

    alert("Bug report submitted! Check the console for details.");
    setBugType("");
    setMessage("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1 className="text-3xl font-bold mb-4">Bug Report Form</h1>
      <form>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="bugType" style={{ display: "block", fontWeight: "bold" }}>
            Bug Type
          </label>
          <select
            id="bugType"
            value={bugType}
            onChange={(e) => setBugType(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            <option value="" disabled>
              Select a bug type
            </option>
            <option value="UI Issue">UI Issue</option>
            <option value="Performance Issue">Performance Issue</option>
            <option value="Crash">Crash</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="message" style={{ display: "block", fontWeight: "bold" }}>
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={submitBugReport}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2aadef",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#444fe6")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2aadef")}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugReportForm;