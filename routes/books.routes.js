const router = require("express").Router();
const booksController = require("../controllers/books.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { validateRequestBody } = require("../middlewares/validators");
const { uploadCoverImage } = require("../helpers/multer");

router
  .route("/books")
  .get(asyncHandler(booksController.getAllData))
  .post(
    asyncHandler(uploadCoverImage),
    asyncHandler(validateRequestBody(booksController.BooksJoiSchema.AddData)),
    asyncHandler(booksController.addData)
  );

router
  .route("/book/:id")
  .get(asyncHandler(booksController.getDataById))
  .patch(
    asyncHandler(
      validateRequestBody(booksController.BooksJoiSchema.UpdateData)
    ),
    asyncHandler(booksController.updateData)
  )
  .delete(asyncHandler(booksController.deleteDataById));

module.exports = router;
