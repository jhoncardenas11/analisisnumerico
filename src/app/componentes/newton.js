"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const evaluarFuncion = (expr) => {
  return new Function("x", `return ${expr};`);
};

const derivarFuncion = (expr) => {
  return new Function(
    "x",
    `return ((${expr.replace(/x/g, "(x+h)")}) - (${expr})) / h;`
  );
};

const newtonRaphson = (func, dfunc, x0, tolerancia, maxIteraciones) => {
  let historial = [];
  let iteraciones = 0;
  let x = x0;

  while (iteraciones < maxIteraciones) {
    let fx = func(x);
    let dfx = dfunc(x);

    if (Math.abs(dfx) < 1e-10) {
      return {
        error: "La derivada se anuló, no se puede continuar",
        historial,
      };
    }

    let xNuevo = x - fx / dfx;

    historial.push({ iteracion: iteraciones + 1, x, fx });

    if (Math.abs(xNuevo - x) < tolerancia) {
      return { raiz: xNuevo, iteraciones, historial };
    }

    x = xNuevo;
    iteraciones++;
  }

  return { error: "Se alcanzó el número máximo de iteraciones", historial };
};

const Newton = () => {
  const [funcion, setFuncion] = useState("Math.pow(x, 3) - 2*x - 5");
  const [dfuncion, setDFuncion] = useState("3*Math.pow(x, 2) - 2");
  const [x0, setX0] = useState("2");
  const [tolerancia, setTolerancia] = useState("0.0001");
  const [maxIteraciones, setMaxIteraciones] = useState("20");
  const [resultado, setResultado] = useState(null);

  const handleCalcular = () => {
    try {
      const f = evaluarFuncion(funcion);
      const df = evaluarFuncion(dfuncion);
      const res = newtonRaphson(
        f,
        df,
        parseFloat(x0),
        parseFloat(tolerancia),
        parseInt(maxIteraciones)
      );
      setResultado(res);
    } catch (error) {
      setResultado({ error: "Error en la función ingresada" });
    }
  };

  return (
    <div className="w-[95%] md:w-[80%] mt-12 mx-auto bg-gray-800 p-6 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Método de Newton-Raphson</h2>

      {/* Inputs */}
      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400"
          placeholder="Función (Ej: Math.pow(x, 3) - 2*x - 5)"
          value={funcion}
          onChange={(e) => setFuncion(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400"
          placeholder="Derivada (Ej: 3*Math.pow(x, 2) - 2)"
          value={dfuncion}
          onChange={(e) => setDFuncion(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400"
          placeholder="Valor inicial x0"
          value={x0}
          onChange={(e) => setX0(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400"
          placeholder="Tolerancia"
          value={tolerancia}
          onChange={(e) => setTolerancia(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400"
          placeholder="Máx iteraciones"
          value={maxIteraciones}
          onChange={(e) => setMaxIteraciones(e.target.value)}
        />
      </div>

      {/* Botón */}
      <button
        onClick={handleCalcular}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 p-2 rounded text-white font-bold"
      >
        Calcular
      </button>

      {/* Mostrar Resultado */}
      {resultado && (
        <div className="mt-6 p-4 bg-gray-900 rounded">
          {resultado.error ? (
            <p className="text-red-400">{resultado.error}</p>
          ) : (
            <>
              <p className="text-green-400">
                Raíz encontrada: {resultado.raiz}
              </p>
              <p>Iteraciones: {resultado.iteraciones}</p>

              {/* 📊 Tabla de Iteraciones */}
              <h3 className="mt-6 text-lg font-bold">Tabla de Iteraciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700 mt-2">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="border border-gray-600 px-4 py-2">
                        Iteración
                      </th>
                      <th className="border border-gray-600 px-4 py-2">x</th>
                      <th className="border border-gray-600 px-4 py-2">f(x)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.historial.map((fila, index) => (
                      <tr key={index} className="bg-gray-800 text-center">
                        <td className="border border-gray-600 px-4 py-2">
                          {fila.iteracion}
                        </td>
                        <td className="border border-gray-600 px-4 py-2">
                          {fila.x.toFixed(6)}
                        </td>
                        <td className="border border-gray-600 px-4 py-2">
                          {fila.fx.toExponential(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📊 Gráfico de Convergencia */}
              <h3 className="mt-6 text-lg font-bold">
                Convergencia del Método
              </h3>
              <div className="w-full h-64 bg-gray-700 p-4 rounded">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resultado.historial}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="iteracion" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="x"
                      stroke="#4CAF50"
                      name="Valor de x"
                    />
                    <Line
                      type="monotone"
                      dataKey="fx"
                      stroke="#FF5733"
                      name="f(x)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Newton;
