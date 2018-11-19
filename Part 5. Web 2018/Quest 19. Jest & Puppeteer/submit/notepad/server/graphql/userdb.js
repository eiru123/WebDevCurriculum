const crypto = require('crypto');
const Sequelize = require('sequelize');

class UserDB{
    constructor(dbName){
        this.Users = null;
        this.Files = null;
        this.sequelize = null;
        this.init(dbName);
    }
    init (dbName) {
        this.connect(dbName);
        this.Users = this.sequelize.define('users', {
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
        this.Files = this.sequelize.define('files', {
            userId: {
                type: Sequelize.STRING(32),
                references: {
                    model: this.Users,
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
        
        this.Users.sync()
            .catch(err => {
                console.error(err);
            });
        this.Files.sync()
            .catch(err => {
                console.error(err);
            });
    }
    connect(dbName) {
        this.sequelize = new Sequelize(
            dbName,
            'root',
            'dltmd0617',
            {
                host: 'localhost',
                dialect: 'mysql',
                operatorsAliases: false
            }
        );
        this.sequelize
            .authenticate()
            .catch(err => {
                console.error(err);
            });
    }
    disconnect () {
        this.sequelize.close();
    }
    async userCheck(userId, password){
        let check = false;
       
        const user = await this.Users.findAll({
            where: {
                userId: userId,
                password: this.makeHash().update(password).digest('hex')
            }
        });
        if(user.length !== 0) check = true;
        return check;
    }
    async getUsers(userId){
        const users = this.Users.findAll({
            attributes: ['userId', 'focusedTab', 'cursorPos'],
            where: {userId: userId}
        });
        return users;
    }
    async getFiles(userId){
        const files = this.Files.findAll({
            where: {userId: userId}
        });
        return files;
    }
    getContent(userId, filename){
        return this.Files.findOne({
            where: {
                userId: userId,
                filename: filename
            }
        }).then(result => {
            if(result) return {content: result.dataValues.content};
        }).catch(err=>{
            console.error(err)
        });
    }
    createFiles(userId, filename){
        return this.Files.create({
            userId: userId,
            filename: filename,
            open: 0
        }).catch(err=>{
            console.error(err)
        });
    }
    deleteFile(userId, filename){
        return this.Files.destroy({
            where: {
                userId: userId,
                filename: filename
            }
        }).catch(err => {
            console.error(err);
        });
    }
    updateFile(userId, filename, content){
        return this.Files.update({
            content: content
        }, {
            where: {
                userId: userId,
                filename: filename
            }
        }).then(result => {
            return result;
        }).catch(err => {
            console.error(err);
        });
    }
    async logoutUpdate(userId, data){
        let result;
        result = await this.Users.update({
            focusedTab: data.focusedTab
        }, {
            where: {
                userId: userId
            }
        }).then(result => {
            console.log(result);
            return true;
        });
        result = await this.Files.update({open: 0}, {
            where: {userId: userId}
        }).then(() => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        });
        Promise.all(data.openTabs.map(
            async (name) =>{
                await this.Files.update({
                    open: 1
                }, {
                    where: {
                        userId: userId,
                        filename: name
                    }
                }).then(() => {
                    return true;
                }).catch(err => {
                    console.error(err);
                    return false;
                });
            }
        ));

        return result;
    }
    makeHash(){
        return crypto.createHash('sha256');
    }
}
module.exports = UserDB;