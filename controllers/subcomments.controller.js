const models = require("../models");
const { subComments } = models;
const catchAsync = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const Joi = require("joi");
const { Op } = require("sequelize");

const SubCommentsJoiSchema = {
  AddData: Joi.object({
    commentId: Joi.string().trim().normalize().required(),
    subCommentText: Joi.string().trim().normalize().optional(),
  }).required(),
  UpdateData: Joi.object({
    commentId: Joi.string().trim().normalize().required(),
    subCommentText: Joi.string().trim().normalize().optional(),
  }).required(),
};

// add data
const addData = catchAsync(async (req, res,next) => {
  const {
    body: { commentId, subCommentText },
    file,
  } = req;
  if (!file) {
    return next(new AppError("coverImage is required field", 400));
  }
  let payload = { commentId, subCommentText };
  if (file) {
    const profileImage = file.filename;
    payload = {
      ...payload,
      profileImage,
    };
  }
  const result = await subComments.create({
    ...payload,
  });
  res.status(201).json({
    status: "success",
    count: result.length,
    data: result,
  });
});

// get all data
const getAllData = catchAsync(async (req, res, next) => {
  const { commentId, subCommentText, keyword, include, exclude } = req.query;
  const page = req.query && req.query.page ? parseInt(req.query.page) : 0;
  const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 50;
  const order = req.query && req.query.order ? req.query.order : "ASC";
  const order_by = req.query && req.query.order_by ? req.query.order_by : "id";

  let where = {
    [Op.or]: {
      subCommentText: {
        [Op.iLike]: `%${keyword ? keyword : "%"}%`,
      },
    },
  };
  if (commentId) {
    where.commentId = commentId;
  }

  let excludeFields = [];
  let includeFields = [];
  let attributes;
  if (include) {
    includeFields = JSON.parse(`${include}`);
    attributes = includeFields;
  }
  if (exclude) {
    excludeFields = exclude;
    attributes = { exclude: excludeFields };
  }
  const result = await subComments.findAll({
    where,
    limit,
    offset: page * limit,
    order: [[order_by, order]],
    attributes,
  });
  res.status(201).json({
    status: "success",
    count: result.length,
    data: result,
  });
});

//get specific data by id
const getDataById = catchAsync(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const result = await subComments.findOne({
    where: { id },
  });
  if (!result) {
    return next(new AppError("No data found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    count: result.length,
    data: result,
  });
});

// update data
const updateData = catchAsync(async (req, res, next) => {
  const {
    body: { subCommentText },
    params: { id },
  } = req;

  const result = await subComments.update(
    {
      subCommentText,
    },
    { where: { id } }
  );
  res.status(200).json({
    status: "success",
    data: result,
  });
});

// delete a  Data
const deleteDataById = catchAsync(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  await books.destroy({ where: { id } });
  await res.status(201).json({
    status: "success",
  });
});

module.exports = {
  addData,
  updateData,
  getAllData,
  getDataById,
  deleteDataById,
  SubCommentsJoiSchema,
};
