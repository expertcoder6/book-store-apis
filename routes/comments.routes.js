const router = require("express").Router();
const commentController = require("../controllers/comments.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { validateRequestBody } = require("../middlewares/validators");
const { uploadCoverImage } = require("../helpers/multer");

router
  .route("/comments")
  .get(asyncHandler(commentController.getAllData))
  .post(
    asyncHandler(uploadCoverImage),
    asyncHandler(
      validateRequestBody(commentController.CommentsJoiSchema.AddData)
    ),
    asyncHandler(commentController.addData)
  );

router
  .route("/comment/:id")
  .get(asyncHandler(commentController.getDataById))
  .patch(
    asyncHandler(
      validateRequestBody(commentController.CommentsJoiSchema.UpdateData)
    ),
    asyncHandler(commentController.updateData)
  )
  .delete(asyncHandler(commentController.deleteDataById));

module.exports = router;
