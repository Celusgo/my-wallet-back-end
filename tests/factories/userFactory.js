export function createUser(name, email, password){
    return { 
        name,
        email, 
        password
    };
};

export function createLogin(email, password){
    return {
        email,
        password
    }
};