"use client";
import WorldMap from "@/components/ui/world-map";
import { motion } from "framer-motion";

export default function WorldMapDemo() {
  return (
    <div style={{ padding: '20px 0', background: '#FFFFFF', width: '100%' }}>
      <WorldMap
        lineColor="#C5C8B4"
        dots={[
          {
            start: {
              lat: 21.5433,
              lng: 39.1728,
            }, // Saudi Arabia (Jeddah)
            end: {
              lat: 40.7128,
              lng: -74.006,
            }, // New York
          },
          {
            start: { lat: 21.5433, lng: 39.1728 }, // Saudi Arabia (Jeddah)
            end: { lat: 51.5074, lng: -0.1278 }, // London
          },
          {
            start: { lat: 21.5433, lng: 39.1728 }, // Saudi Arabia (Jeddah)
            end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: -23.5505, lng: -46.6333 }, // Brazil (Sao Paulo)
          },
          {
            start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            end: { lat: -33.8688, lng: 151.2093 }, // Sydney
          },
        ]}
      />
    </div>
  );
}
