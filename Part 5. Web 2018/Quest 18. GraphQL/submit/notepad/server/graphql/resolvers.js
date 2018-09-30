const userDB = require('./userdb');
const auth = require('./auth');
const resolvers = {
    Query: {
        getUser: async (parent, {userId}) => {
            console.log(userId);
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
            console.log(data.openTabs);
            return {
                userId: userId,
                focusedTab: data.focusedTab,
                cursorPos: data.cursorPos,
                existFiles: existFiles,
                openTabs: data.openTabs
            };
        },
        getFile: async (parent, { userId, filename }) => {
            const data = await userDB.getContent(userId, filename);
            return data;
        }
    },
    Mutation: {
        login: async (root, { userId, password }) => {
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
        newFile: async (root, { info }) => {
            try{
                await userDB.createFiles(info.userId, info.filename);
                return true;
            }catch(err){
                console.error(err);
            }
        },
        updateFile: async (root, { info, content }) => {
            try{
                await userDB.updateFile(info.userId, info.filename, content);
                return true;
            }catch(err){
                console.error(err);
            }
        },
        deleteFile: async (root, { info }) => {
            try{
                await userDB.deleteFile(info.userId, info.filename);
                return true;
            }catch(err){
                console.error(err);
            }
        }
    }
}
module.exports = resolvers;