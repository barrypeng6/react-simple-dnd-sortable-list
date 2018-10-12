import React from 'react';
import List from './List';

const styles = {
  box: {
    display: 'flex',
    fontSize: 15,
  },
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      navList: [
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
      ],
      selectedItem: null,
    };
  }

  render() {
    return (
      <div style={styles.box}>
        <List {...this.state} />
      </div>
    );
  }
}

export default App;
