import { useState, useEffect, Fragment } from "react";

import "./App.css";
import Logo from "./assets/logo-workmotion.svg";

function App() {
  const statuses = ["ADDED", "IN-CHECK", "APPROVED", "ACTIVE", "INACTIVE"];

  // Form Fields
  const [employeeName, setEmployeeName] = useState(null);
  const [employeeStatus, setEmployeeStatus] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/employees`);
    const data = await response.json();
    setEmployees(data.data);
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: employeeName,
        status: employeeStatus,
      }),
    });
    setOpenModal(false);
    fetchEmployees();
  };

  const changeStatus = async (id, status) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    fetchEmployees();
  };

  const openStatusBar = (id) => {
    if (currentEmployee === id) return setCurrentEmployee(null);

    setCurrentEmployee(id);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const renderedEmployees = employees.map((employee) => {
    const renderedStatus = statuses.map((status, index) => {
      const statusPosition = statuses.indexOf(employee.status);

      return (
        <div
          className={`status ${index <= statusPosition ? "active" : ""}`}
          key={status}
          onClick={() => changeStatus(employee.id, status)}
        >
          {status}
        </div>
      );
    });
    return (
      <Fragment key={employee.id}>
        <li className="table-row">
          <div className="col col-1" data-label="Employee ID">
            {employee.id}
          </div>
          <div className="col col-2" data-label="Employee Name">
            {employee.name}
          </div>
          <div className="col col-3" data-label="Status">
            {employee.status}
          </div>
          <div className="col col-4" data-label="Action">
            <button
              className="open-status-actions"
              onClick={() => openStatusBar(employee.id)}
            >
              ▼
            </button>
          </div>
        </li>
        {currentEmployee === employee.id && (
          <li className="change-status">{renderedStatus}</li>
        )}
      </Fragment>
    );
  });

  return (
    <>
      {openModal && (
        <div className="popup">
          <div className="modal">
            <i className="close" onClick={() => setOpenModal(false)}>
              &times;
            </i>
            <h3 className="title">Add New Employee</h3>
            <form onSubmit={(e) => addEmployee(e)}>
              <div className="form-field">
                <input
                  required
                  type="text"
                  name="employee-name"
                  placeholder="Employee Name"
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <select
                  required
                  name="employee-status"
                  onChange={(e) => setEmployeeStatus(e.target.value)}
                >
                  <option value="">Employee Status</option>
                  <option value="ADDED">ADDED</option>
                  <option value="IN-CHECK">IN-CHECK</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="form-field">
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="Employees">
        <div className="header">
          <div className="title">
            <img src={Logo} alt="WorkMotion" /> Employees Management
          </div>
          <button onClick={() => setOpenModal(!openModal)}>Add Employee</button>
        </div>

        <div className="table-wrapper">
          <ul className="table">
            <li className="table-header">
              <div className="col col-1">Employee ID</div>
              <div className="col col-2">Employee Name</div>
              <div className="col col-3">Status</div>
              <div className="col col-4">Action</div>
            </li>
            {renderedEmployees}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
