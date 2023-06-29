const models = require("../models");
const { books, comments, subComments } = models;
const catchAsync = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const Joi = require("joi");
const { Op } = require("sequelize");

const BooksJoiSchema = {
  AddData: Joi.object({
    title: Joi.string().trim().normalize().required(),
    description: Joi.string().trim().normalize().required(),
    price: Joi.number().required(),
    discount: Joi.number().required().max(99).min(1),
  }).required(),
  UpdateData: Joi.object({
    title: Joi.string().trim().normalize().optional(),
    description: Joi.string().trim().normalize().optional(),
    price: Joi.number().optional(),
    discount: Joi.number().optional().max(99).min(1),
  }).required(),
};

// add data
const addData = catchAsync(async (req, res,next) => {
  const {
    body: { title, description, price, discount },
    file,
  } = req;
  if (!file) {
    return next(new AppError("coverImage is required field", 400));
  }
  let payload = { title, description, price, discount };
  if (file) {
    const coverImage = file.filename;
    payload = {
      ...payload,
      coverImage,
    };
  }
  const result = await books.create({
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
  const { title, price, discount, keyword, include, exclude } = req.query;
  const page = req.query && req.query.page ? parseInt(req.query.page) : 0;
  const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 50;
  const order = req.query && req.query.order ? req.query.order : "ASC";
  const order_by = req.query && req.query.order_by ? req.query.order_by : "id";

  let where = {
    [Op.or]: {
      title: {
        [Op.iLike]: `%${keyword ? keyword : "%"}%`,
      },
      description: {
        [Op.iLike]: `%${keyword ? keyword : "%"}%`,
      },
    },
  };
  if (title) {
    where.title = title;
  }
  if (price) {
    where.price = price;
  }
  if (discount) {
    where.discount = discount;
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

  const includes = [
    {
      model: comments,
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      include: [
        {
          model: subComments,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
      ],
    },
  ];
  const result = await books.findAll({
    where,
    limit,
    offset: page * limit,
    order: [[order_by, order]],
    attributes,
    include: includes,
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
  const result = await books.findOne({
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
    body: { title, description, price, discount },
    params: { id },
  } = req;

  const result = await books.update(
    {
      title,
      description,
      price,
      discount,
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
  BooksJoiSchema,
};
