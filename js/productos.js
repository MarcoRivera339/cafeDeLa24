let productos = [];

const agregarProducto = (id, producto, precio) => {
    let indice = productos.findIndex(p => p.id == id);

    if (indice !== -1) {
        productos[indice].cantidad++;
        putJSON(productos[indice]);
    } else {
        let nuevoProducto = {
            id: id,
            producto: producto,
            precio: precio,
            cantidad: 1,
        };
        productos.push(nuevoProducto);
        postJSON(nuevoProducto);
    }

    actualizarTabla();
};

const actualizarTabla = () => {
    let tbody = document.getElementById('tbody');
    let total = 0;

    tbody.innerHTML = '';
    
    if (productos.length === 0) {
        document.getElementById('mensajeVacio').style.display = 'block';
    } else {
        document.getElementById('mensajeVacio').style.display = 'none';
    }

    for (let item of productos) {
        let fila = tbody.insertRow();

        let celdaProducto = fila.insertCell(0);
        let celdaCantidad = fila.insertCell(1);
        let celdaPrecio = fila.insertCell(2);
        let celdaTotal = fila.insertCell(3);
        let celdaBoton = fila.insertCell(4);

        celdaProducto.textContent = item.producto;
        celdaCantidad.textContent = item.cantidad;
        celdaPrecio.textContent = item.precio.toFixed(2);
        celdaTotal.textContent = (item.precio * item.cantidad).toFixed(2);

        let boton = document.createElement('button');
        boton.type = 'button';  // Importante: Evita que sea tipo 'submit'
        boton.textContent = 'Borrar';
        boton.className = 'btn btn-danger btn-sm';

        boton.addEventListener('click', (e) => {
            e.preventDefault();  // Previene el comportamiento por defecto
            e.stopPropagation(); // Evita la propagación del evento
            eliminar(item.id);
        });
        
        celdaBoton.appendChild(boton);

        total += item.precio * item.cantidad;
    }

    document.getElementById('total').textContent = total.toFixed(2);
    

};

// Funciones API (POST, GET, PUT, DELETE)
async function postJSON(data) {
    try {
        const response = await fetch("http://localhost:3000/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success POST:", result);
    } catch (error) {
        console.error("Error POST:", error);
    }
}

async function getJSON() {
    try {
        const response = await fetch("http://localhost:3000/productos", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();
        productos = result;
        actualizarTabla();
        
        console.log("Success GET:", result);
    } catch (error) {
        console.error("Error GET:", error);
    }
}

async function putJSON(data) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${data.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        
        console.log("Success PUT:", result);
    } catch (error) {
        console.error("Error PUT:", error);
    }
}

async function deleteJSON(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE",
        });
        const result = await response.json();
        console.log("Success DELETE:", result);
    } catch (error) {
        console.error("Error DELETE:", error);
    }
}

const eliminar = async (id) => {
    try {
        await deleteJSON(id);
        productos = productos.filter(p => p.id !== id);
        actualizarTabla();
    } catch (error) {
        console.error("Error eliminando producto:", error);
    }
};

// Cargar datos al iniciar
window.addEventListener('load', () => {
    getJSON();
});
