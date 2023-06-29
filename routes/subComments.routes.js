const router = require("express").Router();
const subCommentsController = require("../controllers/subcomments.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { validateRequestBody } = require("../middlewares/validators");
const { uploadCoverImage } = require("../helpers/multer");

router
  .route("/sub-comments")
  .get(asyncHandler(subCommentsController.getAllData))
  .post(
    asyncHandler(uploadCoverImage),
    asyncHandler(
      validateRequestBody(subCommentsController.SubCommentsJoiSchema.AddData)
    ),
    asyncHandler(subCommentsController.addData)
  );

router
  .route("/sub-comment/:id")
  .get(asyncHandler(subCommentsController.getDataById))
  .patch(
    asyncHandler(
      validateRequestBody(subCommentsController.SubCommentsJoiSchema.UpdateData)
    ),
    asyncHandler(subCommentsController.updateData)
  )
  .delete(asyncHandler(subCommentsController.deleteDataById));

module.exports = router;
