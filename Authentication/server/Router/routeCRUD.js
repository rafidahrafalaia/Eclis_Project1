const express = require('express');
const router = express.Router();
const crudController = require('../Controllers/CRUD');
const permission = require('../middleware/tokenChecker');
const AuthToken = require('../middleware/tokenChecker');

//user
// router.get('/readAll', crudController.ReadUsersROlePermission)
router.get('/readUser',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.ReadUsers)
router.get('/searchUser',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.SearchUsers)
router.post('/createUser',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateUsers)
router.put('/updateUser',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateUsers)
router.delete('/deleteUser',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteUsers)
//jabatan
router.get('/readJabatan',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.ReadJabatan)
router.get('/searchJabatan',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.SearchJabatan)
router.post('/createJabatan',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateJabatan)
router.put('/updateJabatan',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateJabatan)
router.delete('/deleteJabatan',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteJabatan)
//role
router.get('/readRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission2, crudController.ReadRoles)
router.get('/searchRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission2, crudController.SearchRoles)
router.post('/createRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateRoles)
router.put('/updateRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateRoles)
router.delete('/deleteRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteRoles)
//permission
router.get('/readPermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission1, crudController.ReadPermission)
router.get('/searchPermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission1, crudController.SearchPermission)
router.post('/createPermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreatePermissions)
router.put('/updatePermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdatePermissions)
router.delete('/deletePermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeletePermissions)
// //role_permission
router.get('/readRolePerm',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission1, crudController.ReadRolePermission)
router.get('/searchRolePerm',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission1, crudController.SearchRolePermission)
router.post('/createRolePerm',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateRolePermission)
router.put('/updateRolePerm',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateRolePermission)
router.delete('/deleteRolePerm',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteRolePermission)
// //user_role
router.get('/readUserRole',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission1, crudController.ReadUserRole)
router.get('/searchUserRole',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission1, crudController.SearchUserRole)
router.post('/createUserRole',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateUserRole)
router.put('/updateUserRole',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateUserRole)
router.delete('/deleteUserRole',AuthToken.authenticateBlacklist,AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteUserRole)
//document
router.post('/createDocument',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.CreateDocument)
router.post('/updateDocument',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.UpdateDocument)
router.post('/deleteDocument',AuthToken.authenticateToken,permission.authenticatePermission1,  crudController.DeleteDocument)

module.exports = router