import React from 'react';
import { Smartphone, Laptop, Tv, Gamepad2, Camera, Headphones, Cpu, Watch } from 'lucide-react';

const ELECTRONIC_EQUIPMENT = [
  { icon: Smartphone, size: 74, top: '15%', left: '8%', delay: '0s', duration: '7s' },
  { icon: Laptop, size: 90, top: '65%', left: '12%', delay: '1s', duration: '9s' },
  { icon: Tv, size: 110, top: '20%', left: '78%', delay: '2s', duration: '8s' },
  { icon: Gamepad2, size: 82, top: '72%', left: '82%', delay: '0.5s', duration: '10s' },
  { icon: Camera, size: 70, top: '42%', left: '5%', delay: '1.5s', duration: '8.5s' },
  { icon: Headphones, size: 78, top: '80%', left: '45%', delay: '2.5s', duration: '9.5s' },
  { icon: Cpu, size: 85, top: '10%', left: '48%', delay: '3s', duration: '11s' },
  { icon: Watch, size: 64, top: '48%', left: '90%', delay: '1.8s', duration: '7.5s' }
];

export default function GadgetMorpher() {
  return (
    <div className="orange-satin-bg-container" aria-hidden="true">
      {/* Silky Orange Satin fold highlights */}
      <div className="satin-fold-shine fold-1" />
      <div className="satin-fold-shine fold-2" />
      <div className="satin-fold-shine fold-3" />

      {/* Floating & running electronic equipment layer */}
      <div className="satin-electronics-grid">
        {ELECTRONIC_EQUIPMENT.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="floating-equipment-item"
              style={{
                top: item.top,
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration
              }}
            >
              <IconComp size={item.size} strokeWidth={1.3} color="#ffe0b2" />
            </div>
          );
        })}
      </div>

      {/* Subtle satin ambient glow */}
      <div className="satin-amber-glow" />
    </div>
  );
}
