const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContact = asyncHandler(async (req,res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    console.log('contacts',contacts);
    if(contacts)
    {
        res.status(200).json(contacts);
    }else{
        res.status(401).json({message: "Contacts could not be found."});
    }
});
 
const createContact = asyncHandler(async (req,res) => {
    console.log(1,req.body);
    const {name,email,phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory.");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });

    res.status(201).json({
        contact: contact, 
        message: "Create contact"
    });
});

const getContactById = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }
    res.status(200).json({
        contact: contact,
        message: `Get single contact ${req.params.id}`
    });
});

const updateContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }

    if(contact.user_id.toString() != req.user.id)
    {
        res.status(403);
        throw new Error("User do not have permission to update other user contacts.");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json({
        contact: updatedContact,
        message: `Update contact for ${req.params.id}`
    });
});

// const deleteContact = asyncHandler(async (req, res) => {
//     const contact = await Contact.findById(req.params.id);

//     if (!contact) {
//         return res.status(404).json({ error: "Contact not found." });
//     }

//     if (contact.user_id.toString() !== req.user.id) {
//         return res.status(403).json({ error: "User does not have permission to delete other user contacts." });
//     }

//     await contact.remove();
//     res.status(200).json({ message: `Deleted contact for ${req.params.id}` });
// });

const deleteContact = asyncHandler(async (req, res) => {
    console.log('Deleting contact for ID:', req.params.id);
    console.log('User ID:', req.user.id);

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        console.log('Contact not found.');
        return res.status(404).json({ error: "Contact not found." });
    }

    if (contact.user_id.toString() !== req.user.id) {
        console.log('User does not have permission to delete other user contacts.');
        return res.status(403).json({ error: "User does not have permission to delete other user contacts." });
    }

    // await contact.remove();
    await Contact.deleteOne({_id: req.params.id});
    console.log('Contact deleted successfully.');
    res.status(200).json({ message: `Deleted contact for ${req.params.id}` });
});



module.exports  = {
                    getContact,
                    createContact,
                    getContactById,
                    updateContact,
                    deleteContact
                };