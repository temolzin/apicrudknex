const express = require('express');
const router = express.Router();

//pagina princpal en el navegador
router.get('/', async (req, res) => {
    //res.render('index');
    res.send('Server runing ...');
});

module.exports = router;