module.exports = (err, req, res, next)=> {
    res.status(400).send({ error: err.message }); //if err send cb err msg from fileFilter
}