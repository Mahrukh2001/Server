
const User = require('../models/Users');

const proVisitorToEmployee = async (req, res) => {
  const adminId = req.params.adminId;
  const visitorId = req.params.visitorId;
  try {
    const adminUser = await User.findById({ _id: adminId, isActive: true});
    const visitorUser = await User.findById({ _id: visitorId, isActive: true});
  
    if (!adminUser || !visitorUser) return res.status(404).json({ message: 'Admin or Visitor not found' });
    if (adminUser.userTypeId != 1 && visitorUser.userTypeId != 3) return res.status(403).json({ message: 'Forbidden' });

    visitorUser.userTypeId = 2;
    await visitorUser.save();
    return res.status(200).json({ message: 'Visitor Successfully Promoted to Employee' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const proEmployeeToAdmin = async (req, res) => {
  const adminId = req.params.adminId;
  const employeeId = req.params.employeeId;
  try {
    const admin = await User.findById({ _id: adminId, isActive: true});
    const employee = await User.findById({ _id: employeeId, isActive: true});
  
    if (!admin || !employee) return res.status(404).json({ message: 'Admin or Employee not found' });
    if (admin.userTypeId != 1 && employee.userTypeId != 2) return res.status(403).json({ message: 'Forbidden' });

    employee.userTypeId = 1;
    await employee.save();
    return res.status(200).json({ message: 'Employee Successfully Promoted to Admin' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const demAdminToEmployee = async (req, res) => {
  const defAdminId = req.params.defAdminId;
  const adminId = req.params.adminId;
  try {
    const defAdmin = await User.findById({ _id: defAdminId, isActive: true});
    const admin = await User.findById({ _id: adminId, isActive: true});
  
    if (!defAdmin || !admin) return res.status(404).json({ message: 'User not found' });
    if (admin.default == true) return res.status(403).json({ message: 'Forbidden' });
    if (defAdmin.userTypeId != 1 && admin.userTypeId != 1) return res.status(400).json({ message: 'Bad Req' });

    admin.userTypeId = 2;
    await admin.save();
    return res.status(200).json({ message: 'Admin Successfully Demoted to Employee' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { proVisitorToEmployee, proEmployeeToAdmin, demAdminToEmployee };