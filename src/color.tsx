import React from 'react';
import './color.scss';

export type ColorProps = { name: string; hex: string };

const Color = ({ name, hex }: ColorProps) => {
  return (
    <div>
      <div className="color-background" style={{ '--background-color': hex } as React.CSSProperties}></div>
      <div>{name}</div>
      <div>{hex}</div>
    </div>
  );
};

export default Color;
