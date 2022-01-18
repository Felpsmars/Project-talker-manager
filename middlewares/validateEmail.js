function emailValidation(req, res, next) {
    const { email } = req.body;
    
    // const validate = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
    // const emailValidated = validate.test(email);

    if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

    if (!email.includes('@') || !email.includes('.com')) {
 return res.status(400)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
}

    next();
}

module.exports = emailValidation;
