

module.exports = function(prefix){
    let lastMessage;
    return function(message){
        const now = Date.now();
        
        const sinceLastMessage = now - (lastMessage || now);
        console.log(`${prefix} ${message} + ${sinceLastMessage}ms`);
        lastMessage = now;
    }
}