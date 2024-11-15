const mongoose = require('mongoose');

const templateSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    phase:{
        type: String
    },
    description: {
        type: String
    }
})

async function findTemplateByName(name) {
    try {
        const res = await Template.exists({ name: name });
        if (res) {
            const doc = await Template.findById(res);
            return doc;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function addTemplate(name, image, phase, description) {
    try {
        const newTemplate = new Template({ name: name, image: image, phase: phase, description: description });
        await newTemplate.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}



async function allTemplate() {
    try {
        const res = await Template.find();
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const Template = mongoose.model('Template', templateSchema);


exports.templateModel = Template;
exports.findTemplateByName = findTemplateByName;
exports.allTemplate = allTemplate;
exports.addTemplate = addTemplate;
