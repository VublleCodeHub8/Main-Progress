const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    seenTo: {
        type: Boolean,
        default: false,
    }
})

async function addBugReport(name, email, type, description) {
    try{
        const bugReport = new BugReport({name, email, type, description});
        await bugReport.save();
        return true;
    } catch (error) {
        console.error('Error adding bug report:', error);
        return false;
    }
}

async function getAllBugReports() {
    try{
        const bugReports = await BugReport.find();
        return bugReports;
    } catch (error) {
        console.error('Error getting all bug reports:', error);
        return [];
    }
}

async function deleteBugReport(id) {
    try {
        const bugReport = await BugReport.findByIdAndDelete(id);
        // console.log(bugReport);
        if (!bugReport) {
            throw new Error('Bug report not found');
        }
        return true;
    } catch (error) {
        console.error('Error deleting bug report:', error);
        throw error;
    }
}

async function toggleSeenStatus(id) {
    try {
        const bugReport = await BugReport.findById(id);
        if (!bugReport) return false;
        
        bugReport.seenTo = !bugReport.seenTo;
        await bugReport.save();
        return true;
    } catch (error) {
        console.error('Error toggling bug report seen status:', error);
        return false;
    }
}

const BugReport = mongoose.model('BugReport', bugReportSchema);

exports.addBugReport = addBugReport;
exports.getAllBugReports = getAllBugReports;
exports.deleteBugReport = deleteBugReport;
exports.toggleSeenStatus = toggleSeenStatus;