const express = require('express');
const router = express.Router();
const crudController = require('../Controllers/CRUD');
const permission = require('../middleware/tokenChecker');
const AuthToken = require('../middleware/tokenChecker');

//user
// router.get('/readAll', crudController.ReadUsersROlePermission)
router.get('/readUser',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.ReadUsers)
router.get('/searchUser',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.SearchUsers)
router.post('/createUser',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.CreateUsers)
router.put('/updateUser',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.UpdateUsers)
router.delete('/deleteUser',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.DeleteUsers)
//jabatan
router.get('/readJabatan',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.ReadJabatan)
router.get('/searchJabatan',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.SearchJabatan)
router.post('/createJabatan',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.CreateJabatan)
router.put('/updateJabatan',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.UpdateJabatan)
router.delete('/deleteJabatan',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.DeleteJabatan)
//role
router.get('/readRoles',AuthToken.authenticateToken,AuthToken.authenticateBlacklist, permission.authenticatePermission1, crudController.ReadRoles)
router.get('/searchRoles',AuthToken.authenticateToken,AuthToken.authenticateBlacklist, permission.authenticatePermission1, crudController.SearchRoles)
router.post('/createRoles',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.CreateRoles)
router.put('/updateRoles',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.UpdateRoles)
router.delete('/deleteRoles',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.DeleteRoles)
//permission
router.get('/readPermission',AuthToken.authenticateToken,AuthToken.authenticateBlacklist, permission.authenticatePermission1, crudController.ReadPermission)
router.get('/searchPermission',AuthToken.authenticateToken,AuthToken.authenticateBlacklist, permission.authenticatePermission1, crudController.SearchPermission)
router.post('/createPermission',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.CreatePermissions)
router.put('/updatePermission',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.UpdatePermissions)
router.delete('/deletePermission',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.DeletePermissions)
// //role_permission
// router.get('/readRolePerm',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.ReadRolePermission)
// router.get('/searchRolePerm',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.SearchRolePermission)
router.post('/createRolePerm',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.CreateRolePermission)
router.put('/updateRolePerm',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.UpdateRolePermission)
router.delete('/deleteRolePerm',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.DeleteRolePermission)
// //user_role
// router.get('/readUserRole',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.ReadUserRole)
// router.get('/searchUserRole',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.SearchUserRole)
router.post('/createUserRole',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.CreateUserRole)
router.put('/updateUserRole',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.UpdateUserRole)
router.delete('/deleteUserRole',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission2, crudController.DeleteUserRole)
//document
router.post('/createDocument',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.CreateDocument)
router.post('/updateDocument',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1, crudController.UpdateDocument)
router.post('/deleteDocument',AuthToken.authenticateToken,AuthToken.authenticateBlacklist,permission.authenticatePermission1,  crudController.DeleteDocument)

module.exports = router