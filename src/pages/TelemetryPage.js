import React, { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { AuthContext } from "../AuthContext";

// Memoized chart card component
const ChartCard = React.memo(function ChartCard({
  title,
  dataKey,
  stroke,
  yDomain,
  data,
}) {
  // Guard: no data yet
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          {title}
        </h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const lastIndex = data.length - 1;

  return (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
      <XAxis />
      <YAxis domain={yDomain} tick={{ fill: "var(--color-text)" }} />
      <Tooltip
        isAnimationActive={false}
        labelFormatter={(t) => new Date(t).toLocaleString()}
        contentStyle={{
          backgroundColor: "var(--color-bg)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      />
      <Legend verticalAlign="top" height={36} />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={stroke}
        isAnimationActive={false}
        connectNulls={false}
        dot={false}
        label={({ x, y, index }) => {
          const lastIndex = data.length - 1;
          if (index === lastIndex && data[index][dataKey] != null) {
            const value = data[index][dataKey];
            const offsetX = -60; // move left
            const offsetY = -30; // move up
            return (
              <g>
                {/* diagonal pointer line */}
                <line
                  x1={x + offsetX}
                  y1={y + offsetY}
                  x2={x}
                  y2={y}
                  stroke="yellow"
                  strokeWidth={2}
                />
                {/* label text */}
                <text
                  x={x + offsetX}
                  y={y + offsetY - 5}
                  fill="white"
                  fontSize={11}
                  fontWeight="bold"
                  textAnchor="start"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          }
          return null;
        }}
      />
      {/* Highlight last value with a pointer line + value */}
      {data.length > 0 && (
        <>
          <ReferenceLine
            x={data[data.length - 1].time}
            stroke="yellow"
            strokeDasharray="3 3"
            ifOverflow="visible"
          />
          <ReferenceDot
            x={data[data.length - 1].time}
            y={data[data.length - 1][dataKey]}
            r={0} // invisible dot
            label={{
              value: data[data.length - 1][dataKey]?.toFixed(1),
              position: "top",
              fill: "white",
              fontSize: 11,
              fontWeight: "bold",
            }}
          />
        </>
      )}
    </LineChart>
  </ResponsiveContainer>
  );
});

export default function TelemetryPage() {
  const [telemetry, setTelemetry] = useState([]);

  const { jwt, loading } = useContext(AuthContext);

  console.log("TelemetryPage render → jwt:", jwt, "loading:", loading);


  useEffect(() => {

    console.log("useEffect triggered with:", { jwt, loading });
    
    if (loading || !jwt) {
      console.log("Telemetry skipped — loading:", loading, "jwt:", jwt);
      return;
    }
    
    console.log("JWT in TelemetryPage:", jwt);
    
    const fetchTelemetry = () => {
      console.log("Fetching telemetry with JWT:", jwt);
      
      console.log("Sending fetch with headers:", {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        });

        fetch("/data/telemetry", {
          headers: {
            "Authorization": `Bearer ${jwt}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include",
        })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((rows) => {
          const pts = rows
            .slice(0, 10000)
            .reverse()
            .map((r) => ({
              ...r,
              time: new Date(r.ts).getTime(),
              weight: r.weight >= 0 && r.weight <= 30 ? r.weight : null,
            }));
          setTelemetry(pts);
        })
        .catch(console.error);
    };

    fetchTelemetry();
    const iv = setInterval(fetchTelemetry, 60000);
    return () => clearInterval(iv);
  }, [jwt, loading]);


  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-100">
        Telemetry Dashboard
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="DHT Temp (°C)"
          dataKey="dht_temp_c"
          stroke="#ff7300"
          yDomain={[-10, 40]}
          data={telemetry}
        />
        <ChartCard
          title="Humidity (%)"
          dataKey="dht_humidity"
          stroke="#387908"
          yDomain={[0, 100]}
          data={telemetry}
        />
        <ChartCard
          title="Weight (g)"
          dataKey="weight"
          stroke="#8884d8"
          yDomain={[0, 30]}
          data={telemetry}
        />
        <ChartCard
          title="Outside Temp (°C)"
          dataKey="sensor2_temp_c"
          stroke="#00bcd4"
          yDomain={[-10, 40]}
          data={telemetry}
        />
        <ChartCard
          title="Electronics Temp (°C)"
          dataKey="sensor1_temp_c"
          stroke="#f44336"
          yDomain={[-10, 40]}
          data={telemetry}
        />
      </div>
    </div>
  );
}
