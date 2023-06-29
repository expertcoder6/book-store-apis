module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "comments",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "books",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      profileImage: {
        type: DataTypes.STRING(500),
      },
      commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
    }
  );
    Comments.associate = (models) => {
      Comments.hasMany(models.subComments, {
        foreignKey: { name: "commentId", allowNull: false },
        sourceKey: "id",
        onDelete: "CASCADE",
      });
       Comments.belongsTo(models.books, {
         foreignKey: { name: "bookId", allowNull: false },
         targetKey: "id",
         onDelete: "CASCADE",
       });
    };
  return Comments;
};
