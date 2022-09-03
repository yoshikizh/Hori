module.exports = [
	(req, res, next) => {
		console.log("helo middleware")
		next()
	}
]