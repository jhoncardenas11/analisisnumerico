"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { evaluate } from "mathjs";

Chart.register(...registerables);

export default function BisectionMethod() {
  const [expression, setExpression] = useState("x^3 - x - 2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [tolerance, setTolerance] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [result, setResult] = useState(null);

  const findValidInterval = () => {
    let an = -10,
      bn = 10;
    while (an < bn) {
      let f_a = evaluate(expression, { x: an });
      let f_b = evaluate(expression, { x: bn });
      if (f_a * f_b < 0) {
        setA(an);
        setB(bn);
        return;
      }
      an++;
      bn--;
    }
  };

  const calculateTolerance = () => {
    let tol = Math.abs(b - a) / Math.pow(2, 10);
    setTolerance(tol);
  };

  const bisection = () => {
    let an = parseFloat(a);
    let bn = parseFloat(b);
    let tol = tolerance || Math.abs(bn - an) / Math.pow(2, 10);
    setTolerance(tol);
    let iterData = [];
    let mid;

    while (Math.abs(bn - an) > tol) {
      mid = (an + bn) / 2;
      let f_a = evaluate(expression, { x: an });
      let f_mid = evaluate(expression, { x: mid });

      iterData.push({ an, bn, mid, f_mid });

      if (f_a * f_mid < 0) {
        bn = mid;
      } else {
        an = mid;
      }
    }
    setIterations(iterData);
    setResult(mid);
    generateChart(iterData);
  };

  const generateChart = (data) => {
    const labels = data.map((_, index) => index + 1);
    const midpoints = data.map((item) => item.mid);
    setChartData({
      labels,
      datasets: [
        {
          label: "Puntos medios",
          data: midpoints,
          borderColor: "#6366f1",
          fill: false,
        },
      ],
      options: {
        scales: {
          x: { type: "linear", position: "bottom" },
          y: { type: "linear" },
        },
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Método de Bisección</h2>
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Función (ej: x^3 - x - 2)"
            className="mb-2"
          />
          <div className="grid grid-cols-3 gap-2 mb-2">
            <Input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="a"
            />
            <Input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="b"
            />
            <Input
              type="number"
              value={tolerance || "Calculando..."}
              readOnly
              placeholder="Tolerancia"
            />
          </div>
          <div className="flex gap-2 mb-2">
            <Button onClick={findValidInterval} className="flex-1">
              Calcular Intervalo
            </Button>
            <Button onClick={calculateTolerance} className="flex-1">
              Calcular Tolerancia
            </Button>
          </div>
          <Button onClick={bisection} className="w-full">
            Calcular Raíz
          </Button>
        </CardContent>
      </Card>
      {result !== null && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Raíz aproximada:</h3>
            <p className="text-xl font-bold">{result.toFixed(6)}</p>
          </CardContent>
        </Card>
      )}
      {iterations.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Iteraciones</h3>
            <table className="w-full text-left border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2">n</th>
                  <th className="border px-2">a</th>
                  <th className="border px-2">b</th>
                  <th className="border px-2">c</th>
                  <th className="border px-2">f(c)</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border px-2">{index + 1}</td>
                    <td className="border px-2">{item.an.toFixed(4)}</td>
                    <td className="border px-2">{item.bn.toFixed(4)}</td>
                    <td className="border px-2">{item.mid.toFixed(4)}</td>
                    <td className="border px-2">{item.f_mid.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      {chartData && (
        <Card className="mt-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">
              Gráfica de convergencia
            </h3>
            <Line data={chartData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
