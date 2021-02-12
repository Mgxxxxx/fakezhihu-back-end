module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING
        },
        pwd: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        avatarUrl: {
            type: DataTypes.TEXT,
        },
        headline: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    })
    return User;
}