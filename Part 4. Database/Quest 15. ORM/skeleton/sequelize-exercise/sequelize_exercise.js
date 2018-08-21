const User = require('./user');
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
const hash = crypto.createHash('sha256');
// const sequelize = new Sequelize('mysql://localhost:3306/test', {})
sequelize
    .authenticate()
    .then(()=>{
        console.log('Connection success');
    })
    .catch(err => {
        console.error(err);
    });

const Users = sequelize.define('User', {
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
// Users.hasMany(Files, {as: 'userFile'});
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
// Files.findAll().then(users => {
//     if(users.length !== 0) console.log(users);
// });
Users.findOrCreate({
    where: {userId: 'seung'},
    defaults: {password: hash.update('4567').digest('hex')}
}).spread((user, created) => {
    if(created){
        console.log('new', user.dataValues);
    }else{
        console.log('old', user.dataValues);
    }
}).catch(err => {
    console.error(err);
});

// Users.update(
//     {focusedTab: 'newTab'},
//     {where: {userId: 'seung'}}
// ).then(result => {
//     console.log(result);
// }).catch(err => {
//     console.error(err);
// });
Users.findAll({
    where: {
        userId: 'seung'
    }
}).then(users => {
    console.log('seung');
    console.log(users[0].dataValues);
});
// Users.destroy({
//     where: {userId: 'seung'}
// }).then(result => {
//     console.log(result);
// }).catch(err => {
//     console.error(err);
// });
Users.hasMany(Files, {foreignKey: 'userId'});
Users.find({
    where: {userId: 'knowre'},
    include: {model: Files}
}).then(result => {
    console.log('association');
    console.log(result.files[0]);
}).catch(err => {
    console.error(err);
});