import uuid from 'react-native-uuid';
export const getRandomId = () => {
    const id = uuid.v4()
    return id;
};
