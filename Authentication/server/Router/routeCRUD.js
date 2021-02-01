const express = require('express');
const router = express.Router();
const crudController = require('../Controllers/CRUD');

//user
router.post('/updateUser', crudController.UpdateUsers)
router.post('/deleteUser', crudController.DeleteUsers)
//jabatan
router.post('/createJabatan', crudController.CreateJabatan)
router.post('/updateJabatan', crudController.UpdateJabatan)
router.post('/deleteJabatan', crudController.DeleteJabatan)
//role
router.post('/createRoles', crudController.CreateRoles)
router.post('/updateRoles', crudController.UpdateRoles)
router.post('/deleteRoles', crudController.DeleteRoles)
//permission
router.post('/createPermission', crudController.CreatePermissions)
router.post('/updatePermission', crudController.UpdatePermissions)
router.post('/deletePermission', crudController.DeletePermissions)

module.exports = router