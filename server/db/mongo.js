import mongoose from 'mongoose';

export async function connect() {
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Connected with mongo');
        })
        .catch(e => {
            console.log(e);
            console.log('Error connecting with mongo. Trying again...');
            connect();
        });
}
