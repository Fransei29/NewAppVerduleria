const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path')
const { sequelize, Product } = require('./models/db'); // Asegúrate de que esta ruta sea correcta

// Middleware
app.use(express.json());

// Configura el middleware para servir archivos estáticos desde la carpeta 'public'
app.use('public', express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo JSON
app.get('/products.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.json'));
});

// Ruta para listar productos
app.get('/products.json', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para comprar un producto
app.post('/comprar', async (req, res) => {
  try {
    const { items } = req.body; // Array de { product_id, quantity }
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.product_id} no encontrado` });
      }

      totalAmount += product.price * item.quantity;
    }

    res.status(200).json({ message: 'Compra realizada con éxito', totalAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sincronizar modelos y arrancar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error al sincronizar modelos:', err);
  });
