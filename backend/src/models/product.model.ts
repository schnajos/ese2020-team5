import { Optional, Model, Sequelize, DataTypes } from 'sequelize';
import {User} from './user.model';

export interface ProductAttributes {
    productId: number;
    title: string;
    type: number;
    description: string;
    location: string;
    sellOrLend: number;
    price: number;
    priceKind: number;
    status: number;
    deliverable: number;
    approved: number;
    userId: number;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId'> { }

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    productId!: number;
    title!: string;
    type!: number; // type == 0: product, type == 1: service
    description!: string;
    location: string;
    sellOrLend!: number; // sellOrLend == 0: sell, sellOrLend == 1: lend
    price!: number;
    priceKind!: number; // priceKind == 0: fixed, priceKind == 1: price/hour, priceKind == 2: price/day
    status!: number; // status == 0: available, status == 1: lent
    deliverable!: number; // deliverable == 1: yes, deliverable == 0: no
    approved!: number; // approved == 0: not yet approved from an admin, approved == 1: product approved by an admin
    userId!: number; // FK of user table

    public static initialize(sequelize: Sequelize) {
        Product.init({
                productId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                type: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                location: {
                    type: DataTypes.STRING
                },
                sellOrLend: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                priceKind: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                status: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                deliverable: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                approved: {
                    type: DataTypes.INTEGER,
                    // allowNull: false,
                    defaultValue: 0
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: 'products'
            }
        );
    }

    public static createAssociations() {
        Product.belongsTo(User, {
            targetKey: 'userId',
            as: 'user',
            onDelete: 'cascade',
            foreignKey: 'userId'
        });
    }

    public static createDefaultProduct() {
        Product.create({ // Create default product
            title: 'TestProduct',
            type: 0,
            description: 'This is a test product',
            location: 'Bern',
            sellOrLend: 0,
            price: 120,
            priceKind: 0,
            status: 0,
            deliverable: 1,
            approved: 0,
            userId: 1
        }).then(product => Promise.resolve(product)).catch(err => Promise.reject(err));
    }
}