const express = require('express');
const { proVisitorToEmployee, proEmployeeToAdmin, demAdminToEmployee } = require('../repositories/actions');

const router = express.Router();

router.get('/promoteVisitor/:adminId/:visitorId', proVisitorToEmployee);
router.get('/promoteEmployee/:adminId/:employeeId', proEmployeeToAdmin);
router.get('/demoteAdmin/:defAdminId/:adminId', demAdminToEmployee);

module.exports = router;