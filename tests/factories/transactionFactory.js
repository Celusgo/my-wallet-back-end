export function createTransaction(idUser, description, value, data){
    return {
        idUser,
        description,
        value,
        data
    };
};