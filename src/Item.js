import React from 'react';

const styles = {
  item: {
    width: 100,
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default ({ name, height, onMouseDown }) => (
  <div
    style={{ ...styles.item, height }}
    onMouseDown={onMouseDown}
  >
    {name}
  </div>
);
