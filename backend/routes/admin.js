const express = require('express');
const router = express.Router();

const { getAllAuth, getAllUsers, getAllContainers , adminLogout , roleChange, addTemplate, removeTemplate,
    getAllBugReportsController, deleteBugReportController, getAllContainerHistoryController, getAllContactUsController, 
    deleteContactUsController, toggleBugReportSeenStatus
 } = require('../controllers/admin')



router.get('/getAllUsers', getAllUsers)

router.get('/getAllContainers', getAllContainers)

router.get('/getAllAuth', getAllAuth)

router.post('/adminLogout', adminLogout)

router.post('/roleChange', roleChange)

router.post('/addTemplate', addTemplate)

router.post('/removeTemplate', removeTemplate)

router.get('/getAllBugReports', getAllBugReportsController  )

router.delete('/deleteBugReport', deleteBugReportController)

router.get('/getAllContainerHistory', getAllContainerHistoryController)

router.get('/getAllContactUs', getAllContactUsController)

router.delete('/deleteContactUs', deleteContactUsController)

router.post('/toggleBugReportSeen', toggleBugReportSeenStatus);

exports.adminRouter = router;