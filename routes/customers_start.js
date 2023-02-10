const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('讀取所有客戶資料');
})
router.get('/:id', (req, res) => {
    res.send(`讀取客戶編號 ${req.params.id} 的資料`)

})

module.exports = router;