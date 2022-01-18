function wactchedATValidation(req, res, next) {
    const { talk } = req.body;
    const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    
    const dateValid = regex.test(talk.watchedAt);

    if (!dateValid) {
 return res.status(400)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' }); 
}
    next();
}

module.exports = wactchedATValidation;