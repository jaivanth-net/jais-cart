import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Headphones, Gamepad2 } from 'lucide-react';

const DISSOLVE_STEPS = [
  {
    id: 'dissolve-j',
    icon: Laptop,
    color: '#ff5722',
    letter: 'J'
  },
  {
    id: 'dissolve-a',
    icon: Smartphone,
    color: '#ff7043',
    letter: 'A'
  },
  {
    id: 'dissolve-i',
    icon: Headphones,
    color: '#ff9800',
    letter: "I'S"
  },
  {
    id: 'dissolve-cart',
    icon: Gamepad2,
    color: '#ffb74d',
    letter: 'CART'
  }
];

export default function IntroGadgetSplash({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    // Pure visual step timer through the 4 gadget-to-letter dissolves
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < DISSOLVE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setAssembled(true);
          return prev;
        }
      });
    }, 1050);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (assembled) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [assembled, onComplete]);

  const current = DISSOLVE_STEPS[stepIndex];
  const IconComp = current.icon;

  return (
    <div className="pure-intro-splash-overlay" onClick={onComplete} role="button" tabIndex={0}>
      <div className="pure-circuit-grid" />

      {!assembled ? (
        <div className="pure-dissolve-stage" key={current.id}>
          {/* Gadget shrinks and dissolves into letter */}
          <div className="pure-gadget-icon" style={{ '--glow': current.color }}>
            <IconComp size={110} strokeWidth={1.4} color={current.color} />
          </div>

          <div className="pure-letter-dissolve" style={{ color: current.color }}>
            {current.letter}
          </div>
        </div>
      ) : (
        <div className="pure-assembled-logo fade-in">
          <span className="p-j">J</span>
          <span className="p-a">A</span>
          <span className="p-i">I&apos;S</span>
          <span className="p-cart">CART</span>
        </div>
      )}
    </div>
  );
}
