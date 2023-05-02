const NoteService = require("../services/note.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


// create & save new contact
exports.create = async (req, res, next) => {
	if(!req.body?.title){
		return next(new ApiError(400,"Title can not be empty"));
	}
	try {
		const noteService = new NoteService(MongoDB.client);
		const document = await noteService.create(req.body);
		return res.send(document);
	}catch(error){
		return next(
			new ApiError(500, "An error occurred while creating the content")
		);
	}
};
//Retrieve all contacts from db
exports.findAll = async (req, res, next) => {
	let documents = [];
	
	try{
		const noteService = new NoteService(MongoDB.client);
		const {name} = req.query;
		if(name){
			documents = await noteService.findByName(name);
		}
		else{
			documents = await noteService.find({});
		}
	}
	catch(error){
		return next(
		new ApiError(500,"An error occurred while retrieving content")
		);
	}
	return res.send(documents);
};
//Find a contact with an id
exports.findOne = async (req, res, next) =>{
	try{
		const noteService = new NoteService(MongoDB.client);
		const document = await noteService.findById(req.params.id);
		if(!document){
			return next(new ApiError(404, "Notes not found")); 
		}
		return res.send(document);
	}
	catch(error){
		return next(
		new ApiError(500,`Error retrieving contacts with id=${req.params.id}`)
		);
	}
};

exports.update = async (req, res, next) =>{
	if(Object.keys(req.body).length ==0){
			return next(new ApiError(400, "Data to update can not be empty")); 
	}
	try{
		const noteService = new NoteService(MongoDB.client);
		const document = await noteService.update(req.params.id, req.body);
		if(!document){
			return next(new ApiError(404, "Notes not found")); 
		}
		return res.send({message: "Notes was updated successfully"});
	}catch(error){
		return next(
		new ApiError(500,`Error updating notes with id=${req.params.id}`)
		);
	}
};

exports.delete = async (req, res, next) =>{
	try{
		const noteService = new NoteService(MongoDB.client);
		const document = await noteService.delete(req.params.id, req.body);
		if(!document){
			return next(new ApiError(404, "Note not found")); 
		}
		return res.send({message: "Note was deleted successfully"});
	}
	catch(error){
		return next(
		new ApiError(500,`Could not delete note with id=${req.params.id}`)
		);
	}
};

exports.deleteAll = (req, res)=>{
    res.send({message: "deleteAll handler"});
};

exports.findAllFavorite = async (_req, res, next) =>{
	try{
		const noteService = new NoteService(MongoDB.client);
		const document = await noteService.findFavorite();
		return res.send(document);
	}
	catch(error){
		return next(
		new ApiError(500,"An error occurred while retrieving favorite contacts")
		);
	}
};

exports.deleteAll = async (_req, res, next) =>{
	try{
		const noteService = new NoteService(MongoDB.client);
		const deletedCount = await noteService.deleteAll();
		return res.send({
			message: `${deletedCount} contacts were deleted successfully`
		});
	}
	catch(error){
		return next(
		new ApiError(500,"An error occurred while removing all contacts")
		);
	}
};
