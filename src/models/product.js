const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

/**
 * Enumeration of valid Product Categories
 */
const Category = {
  UNKNOWN: 'UNKNOWN',
  CLOTHS: 'CLOTHS',
  FOOD: 'FOOD',
  HOUSEWARES: 'HOUSEWARES',
  AUTOMOTIVE: 'AUTOMOTIVE',
  TOOLS: 'TOOLS'
};

/**
 * Product Model
 * 
 * Represents a product in the catalog
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING(250),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  category: {
    type: DataTypes.ENUM(...Object.values(Category)),
    allowNull: false,
    defaultValue: Category.UNKNOWN
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

/**
 * Instance methods
 */
Product.prototype.serialize = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    price: parseFloat(this.price),
    available: this.available,
    category: this.category
  };
};

/**
 * Class methods for finding products
 */
Product.findByName = function(name) {
  return this.findAll({
    where: { name }
  });
};

Product.findByAvailability = function(available = true) {
  return this.findAll({
    where: { available }
  });
};

Product.findByCategory = function(category) {
  return this.findAll({
    where: { category }
  });
};

Product.findByPrice = function(price) {
  return this.findAll({
    where: { price }
  });
};

module.exports = { Product, Category };