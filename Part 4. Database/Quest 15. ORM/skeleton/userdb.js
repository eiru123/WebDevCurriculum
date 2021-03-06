const crypto = require('crypto');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'test',
    'root',
    'dltmd0617',
    {
        host: 'localhost',
        dialect: 'mysql',
        operatorsAliases: false
    }
);

sequelize
    .authenticate()
    .then(()=>{
        console.log('Connection success');
    })
    .catch(err => {
        console.error(err);
    });

const Users = sequelize.define('users', {
    userId: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(64),
        primaryKey: true,
        allowNull: false
    },
    focusedTab: {
        type: Sequelize.STRING(32),
        allowNull: true
    },
    cursorPos: {
        type: Sequelize.MEDIUMINT.UNSIGNED,
        allowNull: true
    },
}, {
    timestamps: false,
    tableName: 'users'
});
const Files = sequelize.define('files', {
    userId: {
        type: Sequelize.STRING(32),
        references: {
            model: Users,
            key: 'userId'
        },
        primaryKey: true,
        allowNull: false
    },
    filename: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
    },
    open: {
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
}, {
    timestamps: false,
    tableName: 'files'
});

Users.sync()
    .then(() => {
        console.log('users table create success');
    })
    .catch(err => {
        console.error(err);
    });
Files.sync()
    .then(() => {
        console.log('files table create success');
    })
    .catch(err => {
        console.error(err);
    });
// Users.hasMany(Files, {as: 'newTable'});
// console.dir(Users);
// console.dir(Files);
class UserDB{
    constructor(){

    }
    async userCheck(userId, password){
        let check = false;
        const user = await Users.findAll({
            where: {
                userId: userId,
                password: this.makeHash().update(password).digest('hex')
            }
        });
        if(user.length !== 0) check = true;
        return check;
    }
    async getUsers(userId){
        const users = Users.findAll({
            where: {userId: userId}
        });
        return users;
    }
    async getFiles(userId){
        const files = Files.findAll({
            where: {userId: userId}
        });
        return files;
    }
    getContent(userId, filename, res){
        Files.findOne({
            where: {
                userId: userId,
                filename, filename
            }
        }).then(result => {
            const jsonData = {data: result.dataValues.content};
            res.json(jsonData);
        });
    }
    createFiles(userId, filename){
        Files.create({
            userId: userId,
            filename: filename,
            open: 0
        }).then(user => {
            console.log(user);
        }).catch(err=>{
            console.error(err)
        });
    }
    deleteFile(userId, filename, res){
        console.log('delete');
        Files.destroy({
            where: {
                userId: userId,
                filename: filename
            }
        }).then(err => {
            res.end();
        });
    }
    updateFile(userId, filename, content, res){
        Files.update({
            content: content
        }, {
            where: {
                userId: userId,
                filename: filename
            }
        }).then(result => {
            console.log(result);
        });
    }
    async logoutUpdate(userId, data){
        await Users.update({
            focusedTab: data.focusedTab,
            cursorPos: data.cursorPosition
        }, {
            where: {
                userId: userId
            }
        }).then(result => {
            console.log(result);
        });
        await Files.update({open: 0}, {
            where: {userId: userId}
        }).then(err => console.error(err));
        data.tabs.forEach(name =>{
            Files.update({
                open: 1
            }, {
                where: {
                    userId: userId,
                    filename: name
                }
            }).then(err => {
                console.error(err);
            })
        });
        return true;
    }
    makeHash(){
        return crypto.createHash('sha256');
    }
}
module.exports = new UserDB();