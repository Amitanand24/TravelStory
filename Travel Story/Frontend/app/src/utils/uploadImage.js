import axiosapi from "./axiosapi";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);  // Ensure 'image' is the correct field name expected by the backend

    try {
        const response = await axiosapi.post('/image-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Explicitly set content type for file uploads
            },
        });

        console.log("Upload successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error.response?.data || error.message || error);
        throw error;
    }
};

export default uploadImage;
