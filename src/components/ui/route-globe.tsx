"use client";

import { useEffect, useRef } from "react";

export type GlobePlace = { name: string; lon: number; lat: number };
type Props = { className?: string };

const places: GlobePlace[] = [
  { name: "London", lon: -0.13, lat: 51.5 },
  { name: "Lagos", lon: 3.38, lat: 6.52 },
  { name: "Nairobi", lon: 36.82, lat: -1.29 },
  { name: "New York", lon: -74, lat: 40.7 },
  { name: "Dubai", lon: 55.27, lat: 25.2 },
  { name: "Mumbai", lon: 72.88, lat: 19.08 },
  { name: "Singapore", lon: 103.82, lat: 1.35 },
];

const hub: GlobePlace = { name: "Tutor Acumen", lon: 3.38, lat: 6.52 };
const toRadians = (value: number) => value * Math.PI / 180;
const point = (place: GlobePlace) => {
  const lon = toRadians(place.lon);
  const lat = toRadians(place.lat);
  return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)] as const;
};

export function RouteGlobe({ className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const context = surface.getContext("2d");
    if (!context) return;
    const hubPoint = point(hub);
    let width = 0;
    let height = 0;
    let ratio = 1;
    let yaw = -0.25;
    let dragging = false;
    let previousX = 0;
    let frame = 0;
    const start = performance.now();

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = element.clientWidth;
      height = element.clientHeight;
      surface.width = width * ratio;
      surface.height = height * ratio;
    };
    const rotate = (value: readonly [number, number, number]) => {
      const [x, y, z] = value;
      return [x * Math.cos(yaw) - z * Math.sin(yaw), y, x * Math.sin(yaw) + z * Math.cos(yaw)] as const;
    };
    const project = (value: readonly [number, number, number], radius: number) => {
      const rotated = rotate(value);
      return { x: width / 2 + rotated[0] * radius, y: height / 2 - rotated[1] * radius, z: rotated[2] };
    };
    const draw = (now: number) => {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.39;
      const pulse = (Math.sin((now - start) / 550) + 1) / 2;
      const glow = context.createRadialGradient(width / 2, height / 2, radius * .55, width / 2, height / 2, radius * 1.2);
      glow.addColorStop(0, "rgba(169,214,193,.2)");
      glow.addColorStop(1, "rgba(169,214,193,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(width / 2, height / 2, radius * 1.2, 0, Math.PI * 2);
      context.fill();

      for (let lat = -80; lat <= 80; lat += 8) {
        for (let lon = -180; lon < 180; lon += 8) {
          const current = point({ name: "", lon, lat });
          const projected = project(current, radius);
          if (projected.z > -0.1) {
            context.globalAlpha = projected.z * .55 + .3;
            context.fillStyle = "#f8f2e8";
            context.beginPath();
            context.arc(projected.x, projected.y, 1.15, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      context.lineWidth = 1.4;
      places.forEach((place, index) => {
        const destination = point(place);
        const steps = 30;
        context.beginPath();
        for (let step = 0; step <= steps; step += 1) {
          const progress = step / steps;
          const blend = [hubPoint[0] * (1 - progress) + destination[0] * progress, hubPoint[1] * (1 - progress) + destination[1] * progress, hubPoint[2] * (1 - progress) + destination[2] * progress] as const;
          const length = Math.hypot(blend[0], blend[1], blend[2]);
          const lifted = [blend[0] / length, blend[1] / length + Math.sin(Math.PI * progress) * .28, blend[2] / length] as const;
          const projected = project(lifted, radius);
          if (step === 0) context.moveTo(projected.x, projected.y);
          else context.lineTo(projected.x, projected.y);
        }
        context.globalAlpha = .42;
        context.strokeStyle = index % 2 ? "#ff7058" : "#f8c46c";
        context.stroke();
        const moving = ((now - start) / 3200 + index / places.length) % 1;
        const destinationPoint = point({ name: "", lon: place.lon, lat: place.lat });
        const blend = [hubPoint[0] * (1 - moving) + destinationPoint[0] * moving, hubPoint[1] * (1 - moving) + destinationPoint[1] * moving, hubPoint[2] * (1 - moving) + destinationPoint[2] * moving] as const;
        const length = Math.hypot(blend[0], blend[1], blend[2]);
        const comet = project([blend[0] / length, blend[1] / length + Math.sin(Math.PI * moving) * .28, blend[2] / length], radius);
        context.globalAlpha = 1;
        context.fillStyle = "#fff8ec";
        context.beginPath();
        context.arc(comet.x, comet.y, 2.8, 0, Math.PI * 2);
        context.fill();
      });

      const center = project(hubPoint, radius);
      context.globalAlpha = 1;
      context.fillStyle = "#ff7058";
      context.beginPath();
      context.arc(center.x, center.y, 4, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(255,112,88,.55)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(center.x, center.y, 10 + pulse * 5, 0, Math.PI * 2);
      context.stroke();
      if (!dragging && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) yaw += .0008;
      frame = requestAnimationFrame(draw);
    };
    const onDown = (event: PointerEvent) => { dragging = true; previousX = event.clientX; surface.setPointerCapture(event.pointerId); };
    const onMove = (event: PointerEvent) => { if (dragging) { yaw += (event.clientX - previousX) / 220; previousX = event.clientX; } };
    const onUp = () => { dragging = false; };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    surface.addEventListener("pointerdown", onDown);
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerup", onUp);
    surface.addEventListener("pointercancel", onUp);
    resize();
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); surface.removeEventListener("pointerdown", onDown); surface.removeEventListener("pointermove", onMove); surface.removeEventListener("pointerup", onUp); surface.removeEventListener("pointercancel", onUp); };
  }, []);

  return <div ref={host} className={`h-[360px] w-full touch-none sm:h-[500px] ${className}`}><canvas ref={canvas} aria-label="Interactive globe showing Tutor Acumen learning connections" role="img" className="h-full w-full cursor-grab active:cursor-grabbing" /></div>;
}
