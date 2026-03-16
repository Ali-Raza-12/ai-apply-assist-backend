import multer from "multer";

export const uploadCVMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["application/pdf"];

        if(!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only PDF files are allowed"), false);
        }

        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});