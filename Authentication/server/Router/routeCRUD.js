const express = require('express');
const router = express.Router();
const crudController = require('../Controllers/CRUD');
const permission = require('../middleware/tokenChecker');
const AuthToken = require('../middleware/tokenChecker');

//user
router.get('/readAll', crudController.ReadUsersROlePermission)
router.get('/readUser', crudController.ReadUsers)
router.get('/searchUser', crudController.SearchUsers)
router.post('/createUser', crudController.CreateUsers)
router.put('/updateUser',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateUsers)
router.delete('/deleteUser',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteUsers)
//jabatan
router.get('/readJabatan', crudController.ReadJabatan)
router.get('/searchJabatan', crudController.SearchJabatan)
router.post('/createJabatan',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateJabatan)
router.put('/updateJabatan',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateJabatan)
router.delete('/deleteJabatan',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteJabatan)
//role
router.get('/readRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission2, crudController.ReadRoles)
router.get('/searchRoles',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission2, crudController.SearchRoles)
router.post('/createRoles',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateRoles)
router.put('/updateRoles',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateRoles)
router.delete('/deleteRoles',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteRoles)
//permission
router.get('/readPermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission2, crudController.ReadPermission)
router.get('/searchPermission',AuthToken.authenticateBlacklist,AuthToken.authenticateToken, permission.authenticatePermission2, crudController.SearchPermission)
router.post('/createPermission',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreatePermissions)
router.put('/updatePermission',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdatePermissions)
router.delete('/deletePermission',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeletePermissions)
// //role_permission
router.get('/readRolePerm',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.ReadRolePermission)
router.get('/searchRolePerm',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.SearchRolePermission)
router.post('/createRolePerm',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.CreateRolePermission)
router.put('/updateRolePerm',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.UpdateRolePermission)
router.delete('/deleteRolePerm',AuthToken.authenticateToken,permission.authenticatePermission2, crudController.DeleteRolePermission)
//document
router.post('/createDocument',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.CreateDocument)
router.post('/updateDocument',AuthToken.authenticateToken,permission.authenticatePermission1, crudController.UpdateDocument)
router.post('/deleteDocument',AuthToken.authenticateToken,permission.authenticatePermission1,  crudController.DeleteDocument)

module.exports = router