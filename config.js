const model = function(){

    const fs = require("fs");
    const MONGO_CLIENT = require("mongodb").MongoClient;

    const mOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    const MONGO_URL = "mongodb://localhost:27017";

	const mongoConn = MONGO_CLIENT.connect(MONGO_URL, mOptions);

	const log = function(error) {
        // Error format = Date: Error...
        let terminator = '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
        let date = (new Date()).toUTCString();

        let content = `\n${terminator}\n${date}\n${JSON.stringify(error)}\n${terminator}\n`;
        // Append the error to stderr.log
		fs.appendFile("./stderr.log", content, function(err) {
			if(err) console.log(err);
		});
        
        // Print the error on the console
		console.error(error);
	};
	
	function genHex(length){
        length = length || 16;
        let counter = 0;
        let generated_hex = "U";
        let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        
        while(counter <= length){
            let rand_index = Math.round((Math.random()*characters.length)+1);
            generated_hex += characters.charAt(rand_index);
            counter += 1;
        }
        console.log(generated_hex);
        return generated_hex;
    }

    return {
		genHex,
        log,
        connection: mongoConn
    };
};

// Export all external functions
module.exports = model();