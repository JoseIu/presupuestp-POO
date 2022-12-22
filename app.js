//Vaiales y Selectores Globales
const presupuestoForm = document.querySelector('#presupuesto-form');
const gastosForm = document.querySelector('#gastos-form');
const gastoList = document.querySelector('#lista');

// let prueba = [];
//Clases/Objetos
class Presupuesto {
	constructor(presupuesto) {
		this.presCantidad = Number(presupuesto);
		this.restante = Number(presupuesto);
		this.gastos = [];
	}
	nuevoGasto(gasto) {
		this.gastos = [...this.gastos, gasto];
		// console.log(this.gastos);
		this.calcularRestante();
	}
	calcularRestante() {
		const gastado = this.gastos.reduce((total, gasto) => total + gasto.nombreCantidad, 0);
		this.restante = this.presCantidad - gastado;
	}
	eliminarGasto(id) {
		this.gastos = this.gastos.filter(gasto => gasto.id !== id);
		// console.log(this.gastos);

		this.calcularRestante();
	}
}
// let presupuestoVal;
class UI {
	//resive el obejto
	insertarPresupuesto(cantidad) {
		const { presCantidad, restante } = cantidad;
		document.querySelector('#price').textContent = presCantidad;
		// console.log(presCantidad);
		document.querySelector('#resto').textContent = restante;
		// console.log(restante);
	}

	agregarGastoLista(gastos) {
		// console.log(gastos);
		this.limpiarDom();
		gastos.forEach(gasto => {
			// console.log(gasto);
			const { nombreGasto, nombreCantidad, id } = gasto;
			const div = document.createElement('div');
			div.classList.add('spent__item');
			div.setAttribute('data-id', id);

			div.innerHTML = /*html */ `
				<p class="spent__gasto-name">${nombreGasto}</p>
				<p class="spent__price-cant">${nombreCantidad}$</p>
				<button class="spent__delete" onClick = "eliminarGasto(${id})" >Borrar</button>`;
			gastoList.append(div);
		});
	}
	limpiarDom() {
		while (gastoList.firstChild) {
			gastoList.removeChild(gastoList.firstChild);
		}
	}

	actualizarRestante(restante) {
		document.querySelector('#resto').textContent = restante;
	}
}
const ui = new UI();
let presupuestoVal;

//funciones
const mesanje = (mensaje, tipo) => {
	const p = document.createElement('p');
	p.classList.add('spent__mensaje');
	p.textContent = mensaje;

	if (tipo === 'presupuesto') {
		presupuestoForm.insertBefore(p, document.querySelector('.spent__btn---long'));
	} else if (tipo === 'gastos') {
		gastosForm.insertBefore(p, document.querySelector('.spent__btn---gasto'));
	}

	setTimeout(() => {
		p.remove();
	}, 2500);
};

const asignarValor = cantidad => {
	presupuestoVal = new Presupuesto(cantidad);
	// console.log(presupuestoVal);
	ui.insertarPresupuesto(presupuestoVal);
};

const validarPresupuesto = e => {
	e.preventDefault();
	const presCantidad = document.querySelector('#presupuesto-form input[type="text"]').value;

	if (isNaN(presCantidad) || presCantidad === '') {
		mesanje('No puede ser letras o estar vacio', 'presupuesto');
	} else if (presCantidad < 0) {
		mesanje('No puede menor que 0', 'presupuesto');
		return;
	}

	asignarValor(presCantidad);
};

//Añade gastos
const agregarGasto = e => {
	e.preventDefault();
	const nombreGasto = document.querySelector('#nombre-gasto').value;
	const nombreCantidad = Number(document.querySelector('#nombre-cantidad').value);

	if (nombreGasto === '' || nombreCantidad === '') {
		mesanje('todos los campos son obligatorios', 'gastos');
		return;
	} else if (isNaN(nombreCantidad)) {
		mesanje('Cantidad tiene que ser un número', 'gastos');
		return;
	} else if (nombreCantidad < 0) {
		mesanje('No puede ser menor a 0', 'gastos');
		return;
	}
	// else if (presupuestoVal === undefined) {
	// 	mesanje('Debe introducir primero el presupuesto', 'presupuesto');
	// 	return
	// }
	const gasto = { nombreGasto, nombreCantidad, id: Date.now() };
	presupuestoVal.nuevoGasto(gasto);

	//IMPRIMIR LOS GASTOS
	const { gastos, restante } = presupuestoVal;

	ui.agregarGastoLista(gastos);

	ui.actualizarRestante(restante);

	gastosForm.reset();
};

const eliminarGasto = id => {
	presupuestoVal.eliminarGasto(id);

	//Elimina los gastos del HTML
	const { gastos, restante } = presupuestoVal;
	ui.agregarGastoLista(gastos);
	ui.agregarGastoLista(gastos);

	ui.actualizarRestante(restante);
};
//Eventos
const eventos = () => {
	presupuestoForm.addEventListener('submit', validarPresupuesto);
	gastosForm.addEventListener('submit', agregarGasto);
};
eventos();
