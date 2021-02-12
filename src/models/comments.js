module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT
        },
        creatorId: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        targetId: {
            type: DataTypes.INTEGER
        },
        targetType: {
            type: DataTypes.INTEGER
        }
    });
    Comment.associate = (models) => {
        Comment.belongsTo(models.users, {
            foreignKey: 'creatorId',
            as: 'author'
        });
        Comment.hasMany(models.comments, {
            foreignKey: 'targetId',
            as: 'comment'
        });
        Comment.hasOne(models.sta, {
            foreignKey: 'targetId',
            as: 'status'
        });
    }
    return Comment;
}