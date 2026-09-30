var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/avatar/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const fileExtension =
      file.originalname.split(".")[
        file.originalname.split(".").length - 1
      ];

    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + fileExtension
    );
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File:", file.originalname);
  console.log("Mimetype:", file.mimetype);

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
  ];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith("image/") ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

var upload = multer({
  storage: storage,

  limits: {
    fileSize: 1024 * 1024 * 5,
  },

  fileFilter: fileFilter,
});

module.exports = upload;