import mongoose from 'mongoose';

const DBconnect=  async ()=>{
try {
    const con= await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connect to Database 🙃`);
} catch (error) {
    console.log(error);
}
};
export default DBconnect;