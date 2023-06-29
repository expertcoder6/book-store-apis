module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define(
    "books",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.STRING(500),
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
    }
  );
  Books.associate = (models) => {
    Books.hasMany(models.comments, {
      foreignKey: { name: "bookId", allowNull: false },
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return Books;
};
