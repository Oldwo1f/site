module.exports = {

  schema: true,
  	attributes: {
  		author:{type:'string',required:true},
  		email:{type:'string',required:true,email:true},
  		content:{type:'text',required:true},
  		status:{type:'string',required:true},
		comment: {
			model: 'comment'
		}
		
	}
};