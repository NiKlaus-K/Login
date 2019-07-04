const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/demo01', {
    useCreateIndex: true,
    useNewUrlParser: true
})

const UserSchema = new mongoose.Schema({
    // username：String  但这样只能写一个参数，无法写多个类型，所以写成对象类型
    //unique: true 唯一认证
    username: { type: String, unique: true },
    password: {
        type: String,
        // 密码加密：使用bcrypt
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
})
const User = mongoose.model('User', UserSchema)
    // User.db.dropCollection('user')删除用户集合
module.exports = { User }