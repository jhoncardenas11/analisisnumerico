"use client";
import Image from "next/image";
import { useState } from "react";
import Biseccion from "./componentes/biseccion";
import Newton from "./componentes/newton";

export default function Home() {
  const [metodo, setMetodo] = useState("biseccion");

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold mt-8 dark text-center">
        Analisis numerico
      </h1>
      <h3 className="text-lg md:text-xl dark text-center mt-4 font-bold">
        Métodos Numéricos para Bisección y Newton-Raphson
      </h3>
      <p className="text-base md:text-lg dark text-center max-w-2xl mx-auto mt-8">
        Una herramienta interactiva que aplica los métodos de bisección y
        Newton-Raphson para encontrar raíces de funciones matemáticas, con
        visualización gráfica y resultados iterativos.
      </p>
      <div className="w-[95%] md:w-[80%] mt-12 mx-auto">
        <label className="block text-gray-200 text-sm font-medium mb-2">
          Selección del método:
        </label>
        <select
          className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
        >
          <option value="biseccion">Método de Bisección</option>
          <option value="newton">Método de Newton-Raphson</option>
        </select>
      </div>
      {/* Sección de Métodos */}
      <div className="w-[95%] md:w-[80%] mt-6 mx-auto">
        {metodo === "biseccion" && <Biseccion />}

        {metodo === "newton" && <Newton />}
      </div>
    </>
  );
}
