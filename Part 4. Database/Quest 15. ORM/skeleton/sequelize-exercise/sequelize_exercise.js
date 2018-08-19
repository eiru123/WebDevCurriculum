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
// const sequelize = new Sequelize('mysql://localhost:3306/test', {})
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
    timestamps: false
});
const Files = sequelize.define('files', {
    userId: {
        type: Sequelize.STRING(32),
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
    timestamps: false
});
sequelize.sync({force: true})
.then(function(err){
    console.log();
});
Users.hasMany(Files, {as: 'userFile'});
Users.findAll().then(users => {
    console.log(users[0].dataValues);
});
Files.findAll().then(users => {
    if(users.length !== 0) console.log(users);
});
