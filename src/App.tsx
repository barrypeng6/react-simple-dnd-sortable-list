import React, { useState, FunctionComponent } from 'react';
import List from './List';

const styles = {
  box: {
    display: 'flex',
    fontSize: 15,
  },
};

export interface IMockData {
  name: string;
}


const MOCK_DATA: IMockData[] = [
  { name: '小强' },
  { name: '小明' },
  { name: '小红' },
  { name: '小白' },
  { name: '小紫' },
  { name: '小黃' },
  { name: '小黑' },
  { name: '小灰' },
  { name: '小均' },
  { name: '小盧' },
]

const App: FunctionComponent =() => {
  return (
    <div style={styles.box}>
        <List datalist={MOCK_DATA} selectedItem={null} direction="row" />
      </div>
  );
}

export default App;
