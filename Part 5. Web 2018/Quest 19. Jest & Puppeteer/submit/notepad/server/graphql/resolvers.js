const userdb = require('./userdb');
const userDB = new userdb('test');
const auth = require('./auth');
const resolvers = {
    Query: {
        // getUser: async (parent, {userId}, {userId}) => {
        getUser: async (parent, _, {userId}) => {
            let data = null;
            let existFiles = [];
            try{
                const files = await userDB.getFiles(userId);
                const userData = await userDB.getUsers(userId);
    
                data = userData[0].dataValues;
                data['openTabs'] = [];
                files.forEach(result => {
                    let fileData = result.dataValues;
                    existFiles.push(fileData.filename);
                    if(fileData.open === 1)
                        data['openTabs'].push(
                            fileData.filename
                        );
                });
            }catch(err){
                console.error(err);
            }
            return {
                userId: userId,
                focusedTab: data.focusedTab,
                cursorPos: data.cursorPos,
                existFiles: existFiles,
                openTabs: data.openTabs
            };
        },
        // getFile: async (parent, { userId, filename }) => {
        getFile: async (parent, { filename }, {userId}) => {
            const data = await userDB.getContent(userId, filename);
            return data;
        }
    },
    Mutation: {
        login: async (root, { userId, password }, {headers}) => {
            let data = null;
            let redirectPath = null;
            const check = await userDB.userCheck(userId, password)
            
            if(check){
                const accessToken = auth.signToken(userId);
                redirectPath = '/';
                data = {
                    accessToken,
                    redirectPath
                };
            } else {
                redirectPath = '/login';
                data = {redirectPath};
            }
            return data;
        },
        logout: async (root, {logoutInfo}, {userId}) => {
            try{
                console.log(logoutInfo);
                return await userDB.logoutUpdate(userId, logoutInfo);
                
            }catch(err){
                console.error(err);
            }
        },
        // newFile: async (root, { info }) => {
        newFile: async (root, { filename }, { userId }) => {
            try{
                // await userDB.createFiles(info.userId, info.filename);
                await userDB.createFiles(userId, filename);
                return true;
            }catch(err){
                console.error(err);
            }
        },
        // updateFile: async (root, { info, content }) => {
        updateFile: async (root, { filename, content }, {userId}) => {
            try{
                // await userDB.updateFile(info.userId, info.filename, content);
                await userDB.updateFile(userId, filename, content);
                return true;
            }catch(err){
                console.error(err);
            }
        },
        // deleteFile: async (root, { info }) => {
        deleteFile: async (root, { filename }, {userId}) => {
            try{
                // await userDB.deleteFile(info.userId, info.filename);
                await userDB.deleteFile(userId, filename);
                return true;
            }catch(err){
                console.error(err);
            }
        }
    }
}
module.exports = resolvers;