module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('questions', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING
        },
        excerpt: {
            type: DataTypes.STRING
        },
        discription: {
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
        }
    })

    Question.associate = models => {
        Question.belongsTo(models.users, {
            foreignKey: 'creatorId',
            as: 'author'
        });
    }
    return Question;
}