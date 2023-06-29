module.exports = (sequelize, DataTypes) => {
  const subComments = sequelize.define(
    "subComments",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      profileImage: {
        type: DataTypes.STRING(500),
      },
      subCommentText: {
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
  subComments.associate = (models) => {
    subComments.belongsTo(models.comments, {
      foreignKey: { name: "commentId", allowNull: false },
      targetKey: "id",
      onDelete: "CASCADE",
    });
  };
  return subComments;
};
