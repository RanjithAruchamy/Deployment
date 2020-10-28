const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const ctrlSport = require('../controllers/sports.controller');
const ctrlForm = require('../controllers/forms.controller');
const jwtHelper = require('../Config/JWThelper');

router.post('/generateToken', ctrlUser.authenticate);
router.post('/register/user', ctrlUser.registerUserMaster);
router.post('/register/sport',jwtHelper.verifyJwtToken, ctrlSport.registerSportsMaster);
router.post('/register/form',jwtHelper.verifyJwtToken, ctrlForm.registerForm);
router.get('/userProfile',jwtHelper.verifyJwtToken , ctrlUser.userProfile);
router.get('/users', jwtHelper.verifyJwtToken , ctrlUser.getAllUser);
router.get('/user',jwtHelper.verifyJwtToken, ctrlUser.getUser);
router.get('/sports',jwtHelper.verifyJwtToken, ctrlSport.getAllSport);
router.get('/sports/:sportId',jwtHelper.verifyJwtToken, ctrlSport.getSport);
router.get('/forms',jwtHelper.verifyJwtToken, ctrlForm.getAllForm);
router.get('/forms/:formId',jwtHelper.verifyJwtToken, ctrlForm.getForm);
router.put('/updateUser',jwtHelper.verifyJwtToken, ctrlUser.updateUserMaster);
router.put('/sports/:sportId',jwtHelper.verifyJwtToken, ctrlSport.updateSport);
router.put('/forms/:formId',jwtHelper.verifyJwtToken, ctrlForm.updateForm);
router.put('/deleteUser',jwtHelper.verifyJwtToken, ctrlUser.deleteUserMaster);
router.delete('/deleteUser/:userId',jwtHelper.verifyJwtToken, ctrlUser.deleteUser);
router.delete('/sports/:sportId',jwtHelper.verifyJwtToken, ctrlSport.deleteSport);
router.delete('/forms/:formId',jwtHelper.verifyJwtToken, ctrlForm.deleteForm);
router.get('/confirmation', ctrlUser.confirmToken);
router.post('/verifyCaptcha', ctrlUser.captchaVerify);

module.exports = router;