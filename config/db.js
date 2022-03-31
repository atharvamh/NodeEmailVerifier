import mongoose from "mongoose";

const connect = () => {
    try {
        const connectionParams = {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }
        mongoose.connect(process.env.DB_URI, connectionParams);
        console.log("Successfully connected to database")
    } catch (error) {
        console.log("Error connecting to database")
    }
}

export default connect;