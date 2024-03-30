const { File } = require('../models/File');
const cloudinary = require('cloudinary').v2;

function isFileTypeSupported(fileType, supportedTypes) {
    return supportedTypes.includes(fileType)
}
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

async function uploadFileToCloudinary(file, folder) {
    const options = { folder }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options)
};
// exports.localFileUpload = async (req, res) => {
//     try {
//         const file = req.files.file;
//         console.log('file' + file);

//         let path = __dirname + '/files/' + Date.now() + '.' + `${file.name.split('.')[1]}`;
//         console.log('path' + path);

//         file.mv(path, (err) => {
//             console.log(err);
//         });

//         res.json({
//             success: true,
//             message: 'local file uploaded successfully'
//         });

//     } catch (err) {

//         console.log(err);
//     }
// };

exports.imageUpload = async (req, res) => {
    try {
        const { name} = req.body;
        console.log(name);

        const file = req.files.imageFile
        console.log(file);

        const supportedTypes = ["jpg", "png", "jpeg"];
        const fileNameParts = file.name.split('.');
        const fileType = fileNameParts[fileNameParts.length - 1].toLowerCase();

        console.log("file type :", fileType)

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File type not supported'
            })
        }

        const response = await uploadFileToCloudinary(file, "DevZenith1");
        console.log(response);

        //adding to the db
        const fileData = await File.create({
            name,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image successfully uploaded'
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "some error occurred while uploading"
        })
    }
};

// exports.videoUpload = async (req, res) => {
//     try {
//         const { name, tags, email } = req.body;
//         console.log(name, tags, email);

//         const file = req.files.videoFile;
//         console.log(file);

//         if (!file || !file.mimetype.startsWith('video/')) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid or unsupported video file'
//             });
//         }

//         if (file.size > MAX_FILE_SIZE_BYTES) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'File size exceeds the limit of 5MB'
//             });
//         }

//         const supportedTypes = ["mp4", "mov"];
//         const fileNameParts = file.name.split('.');
//         const fileType = fileNameParts[fileNameParts.length - 1].toLowerCase();
//         console.log("file type :", fileType);

//         if (!isFileTypeSupported(fileType, supportedTypes)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Unsupported video file format'
//             });
//         }

//         const response = await uploadFileToCloudinary(file, "codehelp");
//         console.log(response);

//         // Store the video URL in the database
//         const fileData = await File.create({
//             name,
//             tags,
//             email,
//             imageUrl: response.secure_url, // Assuming videoUrl is the appropriate field in your File model
//         });

//         res.json({
//             success: true,
//             imageUrl: response.secure_url,
//             message: 'Video successfully uploaded'
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(400).json({
//             success: false,
//             message: "Some error occurred while uploading"
//         });
//     }
// };

