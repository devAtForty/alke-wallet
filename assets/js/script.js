// Base de Datos de Usuarios (Simulada)
const usuarios = [
    { email: "cristobal@wallet.com", pass: "1234", nombre: "Cristóbal", saldo: 1500000 },
    { email: "admin@wallet.com", pass: "admin", nombre: "Administrador", saldo: 500000 }
];


const registrarMovimiento = (tipo, monto) => {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    const nuevaTransaccion = {
        fecha: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        tipo: tipo,
        monto: monto
    };
    movimientos.unshift(nuevaTransaccion);
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
};

// Login
if (window.location.pathname.includes("login.html")) {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const inputEmail = document.querySelectorAll('input')[0].value;
        const inputPass = document.querySelectorAll('input')[1].value;
        const userFound = usuarios.find(u => u.email === inputEmail && u.pass === inputPass);

        if (userFound) {
            localStorage.setItem("sesion", JSON.stringify(userFound));
            localStorage.setItem("movimientos", JSON.stringify([]));
            window.location.href = "menu.html";
        } else {
            alert("Acceso denegado.");
        }
    });
}

const cargarDatos = () => {
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    if (!sesion && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("index.html")) {
        window.location.href = "login.html";
        return;
    }

    const nombreDisplay = document.querySelector("h2.fw-bold");
    const saldoDisplay = document.querySelector(".display-4");
    if (nombreDisplay) nombreDisplay.innerText = `Bienvenido, ${sesion.nombre}`;
    if (saldoDisplay) saldoDisplay.innerText = `$ ${sesion.saldo.toLocaleString('es-CL')}`;

    if (window.location.pathname.includes("transactions.html")) {
        const tabla = document.getElementById("lista-transacciones");
        const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
        
        if (movimientos.length === 0) {
            document.getElementById("sin-movimientos").classList.remove("d-none");
        } else {
            tabla.innerHTML = movimientos.map(m => `
                <tr>
                    <td>${m.fecha}</td>
                    <td>${m.tipo}</td>
                    <td class="text-end ${m.monto > 0 ? 'text-success' : 'text-danger'}">
                        ${m.monto > 0 ? '+' : ''}${m.monto.toLocaleString('es-CL')}
                    </td>
                </tr>
            `).join('');
        }
    }
};

// Depósito
if (window.location.pathname.includes("deposit.html")) {
    document.querySelector(".btn-primary-custom").addEventListener("click", () => {
        const monto = parseInt(document.querySelector('input[type="number"]').value);
        if (monto > 0) {
            let sesion = JSON.parse(localStorage.getItem("sesion"));
            sesion.saldo += monto;
            localStorage.setItem("sesion", JSON.stringify(sesion));
            registrarMovimiento("Depósito", monto);
            alert("Depósito exitoso");
            window.location.href = "menu.html";
        }
    });
}

// Envío
if (window.location.pathname.includes("sendmoney.html")) {
    document.querySelector(".btn-primary-custom").addEventListener("click", () => {
        const monto = parseInt(document.querySelector('input[type="number"]').value);
        let sesion = JSON.parse(localStorage.getItem("sesion"));
        if (monto > 0 && monto <= sesion.saldo) {
            sesion.saldo -= monto;
            localStorage.setItem("sesion", JSON.stringify(sesion));
            registrarMovimiento("Transferencia", -monto);
            alert("Transferencia exitosa");
            window.location.href = "menu.html";
        } else {
            alert("Saldo insuficiente");
        }
    });
}

document.addEventListener("DOMContentLoaded", cargarDatos);