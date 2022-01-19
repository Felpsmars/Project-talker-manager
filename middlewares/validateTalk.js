function talkValidation(req, res, next) {
    const { talk } = req.body;
    // resolvi um problema no req 5, rate não passava e mudei o jeito da condição no talk.rate
    // consultei o repositório da https://github.com/tryber/sd-014-b-project-talker-manager/pull/53/files
    if (!talk || !talk.watchedAt || talk.rate === undefined) {
 return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' }); 
}
    next();
}

module.exports = talkValidation;