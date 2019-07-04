const mongoose = require('mongoose')
const { User } = require('./models')
const express = require('express')
const jwt = require('jsonwebtoken')
    // console.log(express)

//async  异步函数
// async function name([param[, param[, ... param]]]) { statements }
// name 函数名称。
// param 要传递给函数的参数的名称。
// statements 函数体语句。

const app = express()
const SECRET = 'adfasdfasdfasdf'

app.use(express.json())
app.get('/api/users', async(req, res) => {
    const users = await User.find()
    res.send(users)
})

app.post('/api/register', async(req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.send(user)
})

app.post('/api/login', async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.status(422).send({
            message: '用户名不存在'
        })
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            message: '密码无效'
        })
    }
    //生成token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET)
    res.send({
        user,
        token
    })
})

const auth = async(req, res, next) => {
    const raw = (String(req.headers.authorization).split(' ').pop())
    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', auth, async(req, res) => {
    // const raw = (String(req.headers.authorization).split(' ').pop())
    // const { id } = jwt.verify(raw, SECRET)
    // const user = await User.findById(id)
    res.send(req.user)
})

// app.get('/api/orders', auth, async(req, res) => {
//     const orders = await orders.find().where({
//         user: req.user
//     })
//     res.send(orders)
// })



app.listen(3002, () => {
    console.log('http://localhost:3002')
})