const User = require('../models/Users');
const Employee = require('../models/Employee');

// Create Employee
const createEmployee = async (req, res) => {
  try {
    const { employeeId, salary, designation, joiningDate, adminId} = req.body;

    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if ( employee.userTypeId == 3 ) return res.status(400).json({ message: 'User must be an Employee' });

    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.userTypeId != 1) return res.status(403).json({ message: 'Forbidden' });


    const employeeExists = await Employee.findOne({ employeeId: employeeId });
    if (employeeExists) return res.status(400).json({ message: 'Employee data already exists' });

    const newEmployee = new Employee ({
      employeeId,
      salary,
      designation,
      joiningDate,
     
      createdBy: admin.fullName
    });

    await newEmployee.save();
    res.status(201).json({ 
      message: 'Employee Details Created', 
      data: {
        id: newEmployee._id,
        name: employee.fullName,
        employeeId: newEmployee.employeeId,
        salary: newEmployee.salary,
        designation: newEmployee.designation,
        joiningDate: newEmployee.joiningDate,
        createdBy: newEmployee.createdBy,
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get All Employees
const getAllEmployees = async (req, res) => {
  const adminId = req.params.adminId;
  try {
    const admin = await User.findOne({ _id: adminId, userTypeId: 1, isActive: true });
    if (!admin) return res.status(403).json({ message: 'Forbidden' });

    const employees = await Employee.find({ status: true });
    const response = await Promise.all(employees.map(async emp => {
      const user = await User.findOne({ _id: emp.employeeId });
      return {
        id: emp._id,
        name: user ? user.fullName : 'Unknown',
        employeeId: emp.employeeId,
        salary: emp.salary,
        designation: emp.designation,
        joiningDate: emp.joiningDate,
        createdBy: emp.createdBy,
        updatedBy: emp?.updatedBy,
      };
    }));
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get Employee by ID
const getEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const employee = await Employee.findOne({ employeeId: userId, status: true });
    if (!employee) return res.status(404).json({ message: 'Employee data not found' });

    res.status(200).json({
      id: employee._id,
      name: user.fullName,
      employeeId: employee.employeeId,
      salary: employee.salary,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
      createdBy: employee.createdBy,
      updatedBy: employee.updatedBy,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const { adminId, salary, designation, joiningDate, fullName } = req.body;
  const { employeeId } = req.params;

  try {
    // Verify admin user
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.userTypeId !== 1) return res.status(403).json({ message: 'Forbidden' });

    // Find employee by _id (MongoDB's default ID field)
    const employee = await Employee.findOne({ _id: employeeId, status: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Update employee information
    if (salary) employee.salary = salary;
    if (designation) employee.designation = designation;
    if (joiningDate) employee.joiningDate = joiningDate;
    if (fullName) employee.fullName = fullName; // Update fullName if provided

    employee.updatedBy = admin.fullName;
    await employee.save();

    res.status(200).json({
      message: 'Employee updated successfully',
      data: {
        id: employee._id,
        name: employee.fullName,
        employeeId: employee.employeeId,
        salary: employee.salary,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        createdBy: employee.createdBy,
        updatedBy: employee.updatedBy,
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


const deleteEmployee = async (req, res) => {
  const { adminId, leavingDate } = req.body;
  const { employeeId } = req.params; // This should be the MongoDB _id or a unique identifier
  
  try {
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.userTypeId !== 1) return res.status(403).json({ message: 'Forbidden' });

    // If employeeId is meant to target employee._id (MongoDB ID), use _id; otherwise, adjust to employeeId
    const employee = await Employee.findOne({ _id: employeeId, status: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Mark as inactive and set leaving date
    employee.leavingDate = leavingDate || new Date(); // Set leaving date to now if not provided
    employee.status = false;
    employee.updatedBy = admin.fullName;

    await employee.save();
    res.status(200).json({
      message: 'Employee marked as inactive',
      data: {
        id: employee._id,
        employeeId: employee.employeeId,
        leavingDate: employee.leavingDate,
        name: employee.fullName,
      }
    });
  } catch (error) {
    console.error("Error in deleteEmployee:", error.message); // Log specific error message
    res.status(400).json({ message: error.message });
  }
};



module.exports = { createEmployee, getAllEmployees, getEmployee, updateEmployee, deleteEmployee };