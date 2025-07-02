        // Arreglos para almacenar datos
        let clients = [];
        let products = [];
        let sales = [];
        let currentSale = {
            client: null,
            items: [],
            subtotal: 0,
            igv: 0,
            total: 0
        };

        const IGV_RATE = 0.18;

        // Función para mostrar/ocultar secciones
        function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId + 'Section').classList.add('active');

            // Ocultar listas y formularios específicos al cambiar de sección
            document.getElementById('clientList').style.display = 'none';
            document.getElementById('productList').style.display = 'none';
            document.getElementById('salesListContainer').style.display = 'none';
            document.getElementById('sellProductContainer').style.display = 'none';
            document.getElementById('saleSummaryContainer').style.display = 'none';
        }

        // --- Funciones para Clientes ---
        function addClient() {
            const dni = document.getElementById('clientDNI').value.trim();
            const names = document.getElementById('clientNames').value.trim();
            const lastnames = document.getElementById('clientLastnames').value.trim();
            const points = parseInt(document.getElementById('clientPoints').value);

            if (!dni || !names || !lastnames || isNaN(points)) {
                alert('Por favor, complete todos los campos de cliente correctamente.');
                return;
            }

            // Verificar si el DNI ya existe
            if (clients.some(client => client.dni === dni)) {
                alert('Ya existe un cliente con este DNI.');
                return;
            }

            clients.push({ dni, names, lastnames, points });
            alert('Cliente registrado con éxito.');

            // Limpiar campos
            document.getElementById('clientDNI').value = '';
            document.getElementById('clientNames').value = '';
            document.getElementById('clientLastnames').value = '';
            document.getElementById('clientPoints').value = '0';

            // Preguntar si desea ingresar otro registro
            askForMore('client');
        }

        function displayClients() {
            const clientListDiv = document.getElementById('clientList');
            clientListDiv.innerHTML = '<h3>Lista de Clientes</h3>';
            if (clients.length === 0) {
                clientListDiv.innerHTML += '<p>No hay clientes registrados.</p>';
            } else {
                clients.forEach(client => {
                    const clientDiv = document.createElement('div');
                    clientDiv.className = 'list-item';
                    clientDiv.innerHTML = `<strong>DNI:</strong> ${client.dni}<br>
                                           <strong>Nombres:</strong> ${client.names} ${client.lastnames}<br>
                                           <strong>Puntos:</strong> ${client.points}`;
                    clientListDiv.appendChild(clientDiv);
                });
            }
            clientListDiv.style.display = 'block';
        }

        // --- Funciones para Productos ---
        function addProduct() {
            const code = document.getElementById('productCode').value.trim();
            const name = document.getElementById('productName').value.trim();
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const points = parseInt(document.getElementById('productPoints').value);
            const stock = parseInt(document.getElementById('productStock').value);

            if (!code || !name || !category || isNaN(price) || isNaN(points) || isNaN(stock)) {
                alert('Por favor, complete todos los campos de producto correctamente.');
                return;
            }
            if (price <= 0 || stock < 0) {
                alert('El precio debe ser mayor que 0 y el stock no puede ser negativo.');
                return;
            }

            // Verificar si el código ya existe
            if (products.some(product => product.code === code)) {
                alert('Ya existe un producto con este código.');
                return;
            }

            products.push({ code, name, category, price, points, stock });
            alert('Producto registrado con éxito.');

            // Limpiar campos
            document.getElementById('productCode').value = '';
            document.getElementById('productName').value = '';
            document.getElementById('productCategory').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productPoints').value = '0';
            document.getElementById('productStock').value = '0';

            // Preguntar si desea ingresar otro registro
            askForMore('product');
        }

        function displayProducts() {
            const productListDiv = document.getElementById('productList');
            productListDiv.innerHTML = '<h3>Lista de Productos</h3>';
            if (products.length === 0) {
                productListDiv.innerHTML += '<p>No hay productos registrados.</p>';
            } else {
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'list-item';
                    productDiv.innerHTML = `<strong>Código:</strong> ${product.code}<br>
                                            <strong>Nombre:</strong> ${product.name}<br>
                                            <strong>Categoría:</strong> ${product.category}<br>
                                            <strong>Precio:</strong> S/ ${product.price.toFixed(2)}<br>
                                            <strong>Puntos:</strong> ${product.points}<br>
                                            <strong>Stock:</strong> ${product.stock}`;
                    productListDiv.appendChild(productDiv);
                });
            }
            productListDiv.style.display = 'block';
        }

        // --- Función para preguntar si desea ingresar más registros (para Clientes/Productos) ---
        function askForMore(type) {
            let response = '';
            do {
                response = prompt(`¿Deseas ingresar otro registro de ${type}? (S/N)`).toUpperCase();
                if (response === 'S') {
                    return; // Permite seguir en el formulario para un nuevo registro
                } else if (response === 'N') {
                    if (type === 'client') {
                        displayClients();
                    } else if (type === 'product') {
                        displayProducts();
                    }
                    return; // Sale de la función
                } else {
                    alert('Respuesta inválida. Por favor, ingrese S o N.');
                }
            } while (response !== 'S' && response !== 'N');
        }


        // --- Funciones para Ventas ---
        function showSalesList() {
            hideAllSalesSubSections();
            const salesListContainer = document.getElementById('salesListContainer');
            salesListContainer.innerHTML = '<h3>Lista de Ventas Realizadas</h3>';
            if (sales.length === 0) {
                salesListContainer.innerHTML += '<p>No hay ventas realizadas.</p>';
            } else {
                sales.forEach(sale => {
                    const saleDiv = document.createElement('div');
                    saleDiv.className = 'list-item';
                    let itemsHtml = '<ul>';
                    sale.items.forEach(item => {
                        itemsHtml += `<li>${item.quantity} x ${item.product.name} (S/${item.product.price.toFixed(2)} c/u)</li>`;
                    });
                    itemsHtml += '</ul>';

                    saleDiv.innerHTML = `<strong>Fecha:</strong> ${new Date(sale.date).toLocaleString()}<br>
                                         <strong>Cliente:</strong> ${sale.client.names} ${sale.client.lastnames} (DNI: ${sale.client.dni})<br>
                                         <strong>Productos:</strong>${itemsHtml}
                                         <strong>Total Venta:</strong> S/ ${sale.total.toFixed(2)}`;
                    salesListContainer.appendChild(saleDiv);
                });
            }
            salesListContainer.style.display = 'block';
        }

        function startNewSale() {
            hideAllSalesSubSections();
            document.getElementById('sellProductContainer').style.display = 'block';
            document.getElementById('clientSaleInfo').textContent = '';
            document.getElementById('searchClientDNI').value = '';
            document.getElementById('productSelectionSection').style.display = 'none'; // Ocultar hasta buscar cliente
            currentSale = {
                client: null,
                items: [],
                subtotal: 0,
                igv: 0,
                total: 0
            };
            updateSaleCartDisplay();
        }

        function hideAllSalesSubSections() {
            document.getElementById('salesListContainer').style.display = 'none';
            document.getElementById('sellProductContainer').style.display = 'none';
            document.getElementById('saleSummaryContainer').style.display = 'none';
        }

        function searchClientForSale() {
            const dni = document.getElementById('searchClientDNI').value.trim();
            const clientInfoSpan = document.getElementById('clientSaleInfo');
            const productSelectionSection = document.getElementById('productSelectionSection');

            const foundClient = clients.find(c => c.dni === dni);

            if (foundClient) {
                currentSale.client = foundClient;
                clientInfoSpan.textContent = `Cliente: ${foundClient.names} ${foundClient.lastnames} (Puntos: ${foundClient.points})`;
                productSelectionSection.style.display = 'block';
                populateProductDropdown();
            } else {
                clientInfoSpan.textContent = 'Cliente no encontrado. Verifique el DNI.';
                productSelectionSection.style.display = 'none';
            }
        }

        function populateProductDropdown() {
            const select = document.getElementById('saleProductSelect');
            select.innerHTML = '<option value="">Seleccione un producto</option>';
            products.forEach(product => {
                if (product.stock > 0) { // Solo mostrar productos con stock disponible
                    const option = document.createElement('option');
                    option.value = product.code;
                    option.textContent = `${product.name} (S/ ${product.price.toFixed(2)}, Stock: ${product.stock})`;
                    select.appendChild(option);
                }
            });
            document.getElementById('selectedProductPriceInfo').textContent = ''; // Limpiar info de precio
        }

        function displaySelectedProductInfo() {
            const selectedCode = document.getElementById('saleProductSelect').value;
            const productInfoSpan = document.getElementById('selectedProductPriceInfo');
            const selectedProduct = products.find(p => p.code === selectedCode);

            if (selectedProduct) {
                productInfoSpan.textContent = `Precio: S/ ${selectedProduct.price.toFixed(2)} | Stock Disponible: ${selectedProduct.stock}`;
            } else {
                productInfoSpan.textContent = '';
            }
        }

        function addProductToSale() {
            const selectedCode = document.getElementById('saleProductSelect').value;
            const quantity = parseInt(document.getElementById('productQuantity').value);

            if (!selectedCode) {
                alert('Por favor, seleccione un producto.');
                return;
            }
            if (isNaN(quantity) || quantity <= 0) {
                alert('La cantidad debe ser un número positivo.');
                return;
            }

            const productToAdd = products.find(p => p.code === selectedCode);

            if (productToAdd) {
                if (quantity > productToAdd.stock) {
                    alert(`No hay suficiente stock para ${productToAdd.name}. Stock disponible: ${productToAdd.stock}`);
                    return;
                }

                // Verificar si el producto ya está en el carrito
                const existingItem = currentSale.items.find(item => item.product.code === productToAdd.code);

                if (existingItem) {
                    // Si ya existe, solo actualizamos la cantidad
                    if (existingItem.quantity + quantity > productToAdd.stock) {
                        alert(`No puedes añadir más, excedes el stock disponible para ${productToAdd.name}.`);
                        return;
                    }
                    existingItem.quantity += quantity;
                } else {
                    // Si no existe, lo añadimos como un nuevo ítem
                    currentSale.items.push({ product: productToAdd, quantity: quantity });
                }

                updateSaleCartDisplay();
                document.getElementById('productQuantity').value = '1'; // Resetear cantidad
                document.getElementById('saleProductSelect').value = ''; // Resetear selección del dropdown
                document.getElementById('selectedProductPriceInfo').textContent = ''; // Limpiar info de precio del producto seleccionado

                // Preguntar si desea añadir más productos
                let response = '';
                do {
                    response = prompt('¿Desea añadir más productos a la venta? (S/N)').toUpperCase();
                    if (response === 'S') {
                        // Si S, no hace nada, el usuario puede seguir añadiendo
                        return;
                    } else if (response === 'N') {
                        completeSale(true); // Finaliza la venta
                        return;
                    } else {
                        alert('Respuesta inválida. Por favor, ingrese S o N.');
                    }
                } while (response !== 'S' && response !== 'N');

            } else {
                alert('Producto no encontrado.');
            }
        }


        function updateSaleCartDisplay() {
            const cartList = document.getElementById('saleCartList');
            cartList.innerHTML = '';
            currentSale.subtotal = 0;

            currentSale.items.forEach(item => {
                const li = document.createElement('li');
                const itemTotal = item.product.price * item.quantity;
                currentSale.subtotal += itemTotal;
                li.textContent = `${item.quantity} x ${item.product.name} (S/ ${item.product.price.toFixed(2)} c/u) = S/ ${itemTotal.toFixed(2)}`;
                cartList.appendChild(li);
            });

            currentSale.igv = currentSale.subtotal * IGV_RATE;
            currentSale.total = currentSale.subtotal + currentSale.igv;

            document.getElementById('currentSaleSubtotal').textContent = currentSale.subtotal.toFixed(2);
            document.getElementById('currentSaleIGV').textContent = currentSale.igv.toFixed(2);
            document.getElementById('currentSaleTotal').textContent = currentSale.total.toFixed(2);
        }

        function completeSale(showConfirmation = false) {
            if (!currentSale.client) {
                alert('Por favor, busque y seleccione un cliente antes de finalizar la venta.');
                return;
            }
            if (currentSale.items.length === 0) {
                alert('No hay productos en el carrito para finalizar la venta.');
                return;
            }

            if (showConfirmation) {
                const confirmSale = confirm('¿Está seguro de finalizar la venta?');
                if (!confirmSale) {
                    return;
                }
            }


            // Actualizar stock de productos
            currentSale.items.forEach(item => {
                const productInStock = products.find(p => p.code === item.product.code);
                if (productInStock) {
                    productInStock.stock -= item.quantity;
                }
            });

            // Acumular puntos al cliente
            let totalPointsEarned = 0;
            currentSale.items.forEach(item => {
                totalPointsEarned += item.product.points * item.quantity;
            });
            currentSale.client.points += totalPointsEarned;

            // Guardar la venta
            currentSale.date = new Date().toISOString(); // Guarda la fecha en formato ISO
            sales.push({ ...currentSale }); // Clonar el objeto currentSale para guardar una instantánea

            generateSaleSummary();
            document.getElementById('sellProductContainer').style.display = 'none';
            document.getElementById('saleSummaryContainer').style.display = 'block';

            // Resetear para una nueva venta
            currentSale = {
                client: null,
                items: [],
                subtotal: 0,
                igv: 0,
                total: 0
            };
            populateProductDropdown(); // Actualizar el dropdown con el nuevo stock
        }

        function generateSaleSummary() {
            const summaryContent = document.getElementById('saleSummaryContent');
            const lastSale = sales[sales.length - 1]; // Obtener la última venta realizada

            let summaryText = `Fecha: ${new Date(lastSale.date).toLocaleString()}\n`;
            summaryText += `Código cliente: ${lastSale.client.dni}\n`;
            summaryText += `Nombre cliente: ${lastSale.client.names} ${lastSale.client.lastnames}\n\n`;

            summaryText += `Cantidad   CodProducto   Producto       ST (sin igv)\n`;
            summaryText += `--------------------------------------------------\n`;
            lastSale.items.forEach(item => {
                const itemSubtotal = (item.product.price * item.quantity);
                summaryText += `${item.quantity.toString().padEnd(10)} ${item.product.code.padEnd(13)} ${item.product.name.padEnd(14)} S/ ${itemSubtotal.toFixed(2)}\n`;
            });

            summaryText += `\n`;
            summaryText += `                         Sub total: S/ ${lastSale.subtotal.toFixed(2)}\n`;
            summaryText += `                         IGV (18%): S/ ${lastSale.igv.toFixed(2)}\n`;
            summaryText += `                     Total a Pagar: S/ ${lastSale.total.toFixed(2)}\n\n`;
            summaryText += `Gracias por su compra. Regrese pronto\n\n`;

            let giftMessage = '';
            if (lastSale.total > 100) {
                giftMessage = 'Una torta de chocolate';
            } else {
                giftMessage = 'Un paquete de rosquillas';
            }
            summaryText += `Obsequio: ${giftMessage}\n`;
            summaryContent.textContent = summaryText;
        }

        // Inicializar la vista al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            showSection('clients'); // Mostrar la sección de clientes por defecto al cargar
        });
   