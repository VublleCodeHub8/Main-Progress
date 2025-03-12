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
    },
    price: {
        type: Number
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

async function findTemplateById(id) {
    try {
        const res = await Template.findById(id);
        if(res){
            return res;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
}


async function addTemplate(name, image, phase, description, price) {
    try {
        const newTemplate = new Template({ name: name, image: image, phase: phase, description: description, price: price });
        await newTemplate.save();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function updateTemplates(id, { name, phase, description, price }) {
    try {
        if (!id) {
            throw new Error("Template ID is required.");
        }
        const updateData = {};
        if (name) updateData.name = name;
        if (phase) updateData.phase = phase;
        if (description) updateData.description = description;
        if (price) updateData.price = price;

        const result = await Template.findByIdAndUpdate(id, updateData, { new: true });
        if (!result) {
            throw new Error("Template not found.");
        }
        // console.log("Template updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error updating template:", error.message);
        throw error; 
    }
}

async function deleteTemplates(id) {
    try {
        if (!id) {
            throw new Error("Template ID is required.");
        }
        const result = await Template.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Template not found.");
        }
        // console.log("Template deleted successfully:", result);
        return result;
    } catch (error) {
        console.error("Error deleting template:", error.message);
        throw error;
    }
}



async function allTemplate() {
    try {
        const res = await Template.find();
        // console.log(res);
        return res;
    } catch (err) {
        // console.log(err);
        return null;
    }
}

const Template = mongoose.model('Template', templateSchema);


exports.templateModel = Template;
exports.findTemplateByName = findTemplateByName;
exports.allTemplate = allTemplate;
exports.addTemplate = addTemplate;
exports.updateTemplates = updateTemplates;
exports.deleteTemplates = deleteTemplates;
exports.findTemplateById = findTemplateById;