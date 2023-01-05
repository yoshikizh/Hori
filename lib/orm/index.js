module.exports = (adapter) => {
	if (["mongodb"].includes(adapter)){
		global.HoriRecord = require(`./${adapter}/HoriRecord`)
	}
}