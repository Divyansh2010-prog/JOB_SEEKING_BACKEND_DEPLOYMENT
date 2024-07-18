import app from "./app.js"
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLIENT_NAME,
    api_key : process.env.CLOUDINARY_CLIENT_API,
    api_secret : process.env.CLOUDINARY_CLIENT_SECRET
});

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
    if (err) {
        return console.error(`Error occurred: ${err.message}`);
    }
    console.log(`Server is running on port ${PORT}`);
});