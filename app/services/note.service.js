const {ObjectId} = require ("mongodb");

class NoteService{
	constructor(client){
		this.Note = client.db().collection("notes");
	}
	//dinh nghia cac pt CSDL su dung mongoDB API
	
    extractNoteData(payload){
		const note = {
			userId: payload.userId,
			id: payload.id,
			title: payload.title,			
		};
		Object.keys(note).forEach(
			(key) => note[key] === undefined && delete note[key]
		);
		return note;
	}
	
	
	async create(payload){
		const note = this.extractNoteData(payload);
		const result = await this.Note.findOneAndUpdate(
			note,
			{$set: {favorite: note.favorite === true}},
			{returnDocument: "after", upsert: true}
		);
		return result.value;
	}

	async find(filter){
		const cursor = await this.Note.find(filter);
		return await cursor.toArray();
	}

	async findByName(title){
		return await this.find({
			name: {$regex: new RegExp(title), $options: "i"}
		});
	}

	async findById(id) {
		return await this.Note.findOne({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
		});
	}

	async update (id, payload){
		const filter = {
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
		};
		const update = this.extractNoteData(payload);
		const result = await this.Note.findOneAndUpdate(
			filter,{$set : update}, {returnDocument: "after"}
		);
		return result.value;
	}

	async delete (id){
		const result = await this.Note.findOneAndDelete({
			_id: ObjectId.isValid(id) ? new ObjectId(id) : null,}		
		);
		return result.value;
	}

	async findFavorite(){
		return await this.find({favorite: true});
	}

	async deleteAll(){
		const result = await this.Note.deleteMany({});
		return result.deletedCount;
	}
}

module.exports = NoteService;