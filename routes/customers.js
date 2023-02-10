const express = require('express');
const router = express.Router();
const db = require('../models/mysql-connect');

router.get('/', async (req, res) => {
    // res.send('讀取所有客戶資料');
    const sql = "SELECT CustomerID, CompanyName, ContactName, Phone FROM customers";
    const [rows, fields] = await db.query(sql);
    res.json(rows);
})
router.get('/single/:id', async (req, res) => {
    //res.send(`讀取客戶編號 ${req.params.id} 的資料`)
    const sql = "SELECT CustomerID, CompanyName, ContactName, Phone FROM customers WHERE CustomerID = ?";
    const [rows, fields] = await db.query(sql, [req.params.id]);
    res.json(rows[0]);
})

router.post('/', async (req, res) => {
    const { CustomerID, CompanyName, ContactName, Phone } = req.body;

    const sql = "INSERT INTO Customers(CustomerID, CompanyName, ContactName, Phone) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [CustomerID, CompanyName, ContactName, Phone]);
    //console.log(result); 
    //{fieldCount: 0, affectedRows: 1, insertId: 10, info: '', serverStatus: 2, warningStatus: 0}
    let message = '新增發生了錯誤';
    if (result.affectedRows) {
        message = '新增成功';
    }

    res.send(message);
})

router.put('/:id', async (req, res) => {
    const { CompanyName, ContactName, Phone } = req.body;
    const sql = "UPDATE customers SET CompanyName=?, ContactName=?, Phone=? WHERE CustomerID=?";
    const [result] = await db.execute(sql, [CompanyName, ContactName, Phone, req.params.id]);
    let message = '修改沒有成功';
    if (result.affectedRows) {
        message = '修改成功';
    }
    res.send(message);
})

router.delete('/:id', async (req, res) => {
    const sql = "DELETE FROM customers WHERE CustomerID=?";
    const [result] = await db.execute(sql, [req.params.id]);
    //{fieldCount: 0, affectedRows: 1, insertId: 10, info: '', serverStatus: 2, warningStatus: 0}
    let message = '刪除發生了錯誤';
    if (result.affectedRows) {
        message = '刪除成功';
    }
    res.send(message);
})


//客戶在不同國家的統計
router.get('/countrycount', async (req, res) => {
    const sql = `SELECT Country, count(country) as Qty 
                FROM customers 
                WHERE Country is not null 
                GROUP BY Country 
                ORDER BY Qty DESC`;
    const [rows, fields] = await db.query(sql);
    res.json(rows);
})
//根據使用者輸入的資料進行公司名稱及聯絡人名稱的模糊搜尋
router.get('/keyword', async (req, res) => {
    const keyword = `%${req.query.search}%`;
    const sql = `SELECT CustomerID, CompanyName, ContactName, Phone 
                 FROM northwind.customers  
                 WHERE CompanyName like ? OR ContactName like ?`
    const [rows, fields] = await db.query(sql, [keyword, keyword]);
    res.json(rows);
})

//從第11筆資料開始讀取20筆資料
// SELECT * FROM northwind.products ORDER BY ProductID LIMIT 20 offset 10
//如果每頁要顯示10筆資料
//第一頁就是 LIMIT 10 offset 0
//第二頁就是 LIMIT 10 offset 10
//第三頁就是 LIMIT 10 offset 20 可以透過(第三頁 - 1) * 每頁要顯示的資料，來計算
//Records_Per_page= 10;
//offset_value = (page_Number-1) * Records_Per_page;

//讀取在 USA 及 France 的客戶資料
//SELECT * FROM northwind.customers WHERE Country IN('USA','France')

//讀取訂單日期在 1996/9/1 - 1996/9/30 的資料
//SELECT * FROM northwind.orders where OrderDate between '1996-9-1' and '1996-9-30'

//計算員工的銷售金額
// SELECT FirstName, sum(od.UnitPrice * od.Quantity) as total
// FROM northwind.orders as o 
// inner join northwind.`order details` as od on o.OrderID =  od.OrderID
// inner join northwind.employees as e on o.EmployeeID = e.EmployeeID
// where o.EmployeeID=1 





module.exports = router;