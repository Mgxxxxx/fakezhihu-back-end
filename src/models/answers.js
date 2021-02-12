module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('answers', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        excerpt: {
            type: DataTypes.STRING
        },
        creatorId: {
            type: DataTypes.INTEGER
        },
        content: {
            type: DataTypes.TEXT
        },
        type: {
            type: DataTypes.INTEGER
        },
        targetId: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    })

    Answer.associate = models => {
        Answer.belongsTo(models.users, {
            foreignKey: 'creatorId',
            as: 'author'
        });
        Answer.belongsTo(models.questions, {
            foreignKey: 'targetId',
            as: 'question'
        });
        Answer.hasOne(models.sta, {
            foreignKey: 'targetId',
            as: 'status'
        });
    }
    return Answer;
}