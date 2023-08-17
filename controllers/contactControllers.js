
const expressAsyncHandler = require('express-async-handler');

const Contact = require('../models/contactModel')

const asyncHandler = require('express-async-handler')

//@des get all contacts
//@route Get /api/contacts
//@access public
const getContacts = expressAsyncHandler(async(req, res)=> {
        const contacts = await Contact.find({user_id:req.user_id });
        res.status(200).json(contacts)

    })
 
//@des  create new contacts
//@route Get /api/contacts
//@access public
const createContact = expressAsyncHandler(async(req, res)=> {
        console.log('the request body is' + JSON.stringify(req.body));
        const {name, email, phone} = req.body
        console.log(name, email, phone,req.body)
        if(!name || !email || !phone){
                res.status(400);
                throw new Error('All fields are mandatory!')
        }
        const contact = await Contact.create({
                name,
                email,
                phone,
                user_id: req.user.id
        })
        res.status(201).json(contact)
    })
//@des get certain contact
//@route Get /api/contacts
//@access pravite
const getContact = expressAsyncHandler(async(req, res)=> {
        const contact = await Contact.findById(req.params.id)
        if(!contact){
            res.status(404)
            throw new Error("Contact not found")
    
        }
        res.status(200).json(contact)
    })

//@des update certain contact
//@route Get /api/contacts
//@access pravite
const updateContact = expressAsyncHandler(async(req, res)=> {
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("user don't have permission to update other use contacts")}

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        res.status(200).json(updatedContact)
    })



//@des delete all contacts
//@route Get /api/con tacts
//@access pravite
const deleteContact = expressAsyncHandler(async(req, res)=> {
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("user don't have permission to update other use contacts")}
        
    await Contact.findOneAndRemove(req.params.id)
    res.status(200).json(contact)
    })

    module.exports = {getContacts,createContact,getContact,updateContact,deleteContact} 