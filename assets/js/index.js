
async function fetchApiPromise(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error en la solicitud a la API. Código de respuesta: ${response.status}`);
    }

    const data = await response.json();
    return data; 
}

async function main() {
    try {
        const data = await fetchApiPromise("https://mindicador.cl/api/");
        const currencies = {
            "EUR": data.euro.valor,
            "USD": data.dolar.valor,
        };

        const cantidadUno = document.getElementById("cantidad_uno");
        const selectorDos = document.getElementById("selector_dos");
        const cantidadDos = document.getElementById("cantidad_dos");
        const botonBuscar = document.getElementById("botonbuscar");
        const rateDiv = document.getElementById("rate");

        botonBuscar.addEventListener("click", async function() {
            try {
                const cantidadUnoValue = parseFloat(cantidadUno.value);
                const monedaOrigen = "CLP";
                const monedaDestinoSeleccionada = selectorDos.value;
        
                if (isNaN(cantidadUnoValue)) {
                    rateDiv.textContent = "Ingresa una cantidad válida.";
                    return;
                }
        
                if (monedaDestinoSeleccionada === "cual") {
                    rateDiv.textContent = "Selecciona una moneda de destino.";
                    return;
                }
                const tasaCambio = currencies[monedaDestinoSeleccionada];
                const resultado = cantidadUnoValue / tasaCambio;
        
                cantidadDos.value = resultado.toFixed(2);
                rateDiv.textContent = `1 ${monedaOrigen} = ${1 / tasaCambio} ${monedaDestinoSeleccionada}`;
            } catch (error) {
                console.error("Error en la conversión de moneda:", error);
                rateDiv.textContent = "Error en la conversión de moneda.";
            }
        });

        console.log(data);

        const ctx = document.getElementById('myChart');
      
        const chartData = await getDynamicChartData(); 

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'USD',
                        data: chartData.dataSet1,
                        borderWidth: 1
                    },
                    {
                        label: 'EUR',
                        data: chartData.dataSet2,
                        borderWidth: 1
                    }
                ]
            },
            
            options: {
                scales: {
                    x: {
                        
                    },
                    y: {
                        beginAtZero: true,
                        stepSize: 10,
                        min: 850,
                        max: 1100,
                        maintainAspectRatio: false,
                        responsive: true,
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error al obtener la API:", error);
    }
}

async function getDynamicChartData() {
   
    try {
        const dynamicData1 = await fetchApiPromise("https://mindicador.cl/api/");
        const dynamicData2 = await fetchApiPromise("https://mindicador.cl/api/");

        return {
            labels:['2024-02-06', '2024-02-07', '2024-02-08', '2024-02-09', '2024-02-12', '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16', '2024-02-19'], 
            dataSet1:[955.73, 949.81, 947.90, 957.86, 968.73, 972.22, 971.56, 959.86, 961.94, 969.04],
            dataSet2:[1026.34, 1021.08, 1020.23, 1031.95, 1044.57, 1047.76, 1041.22, 1030.00, 1035.01, 1043.55],
        };
    } catch (error) {
        console.error("Error al obtener datos dinámicos:", error);
        return {
            labels: [],
            dataSet1: [],
            dataSet2: [],
        };
    }
}

main();


