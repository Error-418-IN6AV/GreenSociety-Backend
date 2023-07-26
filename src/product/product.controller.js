'use strict'

const Product = require('./product.model')
const Category = require('../category/category.model')
const infoCategory = ['name'];
const { validateData } = require("../utils/validate")
const fs = require('fs')
const path = require('path')

exports.test = (req, res) => {
    res.send({ message: 'Funcion de prueba!' })
}

exports.add = async (req, res) => {
    try {
        let data = req.body;
        //Validar que no exista el producto
        let existPro = await Product.findOne({ name: data.name })
        if (existPro) return res.status(400).send({ message: 'Exist Product' })
        //Validar que exista la categoria
        let existCategory = await Category.findOne({ _id: data.category });
        if (!existCategory) return res.status(400).send({ message: 'Category not found' });

        let product = new Product(data);
        await product.save();
        return res.send({ message: 'Product saved sucessfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error creating Product' })
    }

}

exports.getProducts = async (req, res) => {
    try {
        let products = await Product.find().populate('category', infoCategory)
        return res.send({ message: 'Products found', products })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Products' })
    }
}

exports.getProduct = async (req, res) => {
    try {
        let productId = req.params.id;
        let product = await Product.findOne({ _id: productId }).populate('category', infoCategory)
        if (!product) return res.status(400).send({ message: "Product not found" });
        return res.send({ mesage: "Product found", product })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Product' })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        let productId = req.params.id;
        let data = req.body;
        let existproduct = await Product.findOne({ name: data.name })
        if (existproduct) return res.status(400).send({ message: 'Product already created' })
        if (data.category) return res.status(400).send({ mesage: 'Some params are not aceptend' })
        let updateProduct = await Product.findOneAndUpdate({ _id: productId }, data, { new: true })
        if (!updateProduct) return res.send({ message: 'Product not found' })
        return res.send({ message: 'Product updated sucessfully', updateProduct })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error Updating product ' })
    }
}

exports.search = async (req, res) => {
    try {
        let params = {
            search: req.body.search,
        };
        let validate = validateData(params);
        if (!validate) {
            let searchResult = await Product.find({
                $or: [
                    {
                        name: { $regex: params.search, $options: 'i' }
                    }
                ]
            });
            return res.send({ searchResult })
        }
        if (validate) return res.status(400).send(validate);
        return res.send({ searchResult });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ mesage: "Error searching Product" })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        let idProduct = req.params.id;
        let deletedProduct = await Product.findOneAndDelete({ _id: idProduct });
        if (!deletedProduct) return res.status(404).send({ message: 'Error removing product or already deleted' });
        return res.send({ message: 'Product deleted sucessfully', deletedProduct });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error removing product' })
    }
}

exports.addImage = async (req, res) => {
    try {
        //obtener el id del producto al cual se va a vincular
        const productId = req.params.id; //si es un usuario, y está logeado se puede jalar del token
        const alreadyImage = await Product.findOne({ _id: productId })
        let pathFile = './uploads/products/'
        if (alreadyImage.image) fs.unlinkSync(`${pathFile}${alreadyImage.image}`) //./uploads/products/nombreImage.png
        if (!req.files.image || !req.files.image.type) return res.status(400).send({ message: 'Havent sent image' })
        //crear la ruta para guardar la imagen
        const filePath = req.files.image.path; // \uploads\products\productName.png
        //Separar en jerarqu´+ia la ruta de imagen (linux o MAC ('\'))
        const fileSplit = filePath.split('\\') //fileSplit = ['uploads', 'products', 'productName.png']
        const fileName = fileSplit[2];

        const extension = fileName.split('\.'); //extension = ['productName', 'png']
        const fileExt = extension[1] // fileExt = 'png'
        console.log(fileExt)
        if (
            fileExt == 'png' ||
            fileExt == 'jpg' ||
            fileExt == 'jpeg' ||
            fileExt == 'gif'
        ) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId },
                { image: fileName },
                { new: true }
            )
            if (!updatedProduct) return res.status(404).send({ message: 'Product not found and not updated' });
            return res.send({ message: 'Product updated', updatedProduct })
        }
        fs.unlinkSync(filePath)
        return res.status(404).send({ message: 'File extension cannot admited' });


    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding image', err })
    }
}

exports.getImage = async (req, res) => {
    try {
        const fileName = req.params.fileName;

        if (!fileName || fileName === 'undefined' || fileName === '') {
            //Si el nombre del archivo esta indefinido, que le asigna una imagen predeterminada
            fileName = 'merch.png';
        }
        let pathFile = `./uploads/products/${fileName}`;

        if (!fs.existsSync(pathFile)) {
            //Si la imagen no existe, asigna una de igual forma
            pathFile = `./uploads/products/merch.png`;
        }
        return res.sendFile(path.resolve(pathFile));
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting image' });
    }
}


/*else {price: params.search}
            let searchResult = await Product.find({
                
            });*/