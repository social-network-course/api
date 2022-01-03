export const sortByField = (field) => {
    return (a, b) => {
        if (a[field] < b[field]){
            return -1;
        } else if (a[field] > b[field]){
            return 1;
        } else {
            return 0;
        }
    }
};