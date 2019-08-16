import React, { CSSProperties } from 'react';

const itemStyle: CSSProperties = {
  width: 100,
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default ({ name, height, onMouseDown }: { name: string; height: number; onMouseDown: (e: any) => void; }) => (
  <div
    style={{ ...itemStyle, height }}
    onMouseDown={onMouseDown}
  >
    {name}
  </div>
);
