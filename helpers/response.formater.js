module.exports = {
    response: (status, massage, data) => {
        if(data) {
            return {
                status: status,
                message: massage,
                data: data,
            };
        } else {
            return {
                status: status,
                message: message
            }
        }
    }
};
