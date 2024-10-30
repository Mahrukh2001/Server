const UserType = Object.freeze({
  ADMIN: { id: 1, name: 'Admin', code: 'TA' },
  EMPLOYEE: { id: 2, name: 'Employee', code: 'TE' },
  VISITOR: { id: 3, name: 'Visitor', code: 'TV' }
});

module.exports = UserType;