import React from 'react';

const styles = {
  bix: {
    display: 'flex',
    fontSize: 15,
  },
  items: {
    margin: '20px 30px',
    position: 'relative',
    backgroundColor: '#f6f9fa',
    overflow: 'hidden',
    borderRadius: 4,
    width: 100,
  },
  item: {
    width: 100,
    height: 32,
    textAlign: 'center',
    transition: 'background-color .3s, color .3s, box-shadow .5s',
    cursor: 'pointer',
    userSelect: 'none',
  },
};

const itemHeight = 32;

const getCurrentIndex = ({ selectedIdx, moveY, length }) => {
  const startTop = itemHeight * selectedIdx;
  const presentTop = parseInt(startTop, 10) + (moveY - window.startY);
  let currentIdx = Math.ceil((presentTop - itemHeight / 2) / itemHeight);
  if (currentIdx < 0) currentIdx = 0;
  if (currentIdx > length - 1) currentIdx = length - 1;
  return currentIdx;
};

const getNewListWithoutHold = (navList) => {
  const newList = navList.reduce((ls, ele) => {
    if (ele.name === 'hold') {
      return ls;
    }
    return ls.concat(ele);
  }, []);
  return newList;
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

  componentDidMount() {
    window.document.addEventListener('mouseup', (e) => {
      const { navList, selectedItem } = this.state;
      if (selectedItem) {
        const selectedIdx = selectedItem.idx;
        const moveY = e.clientY;
        const { length } = navList;

        const currentIdx = getCurrentIndex({ selectedIdx, moveY, length });

        const newList = getNewListWithoutHold(navList);

        newList.splice(currentIdx, 0, { name: selectedItem.name });

        this.setState({ navList: newList, selectedItem: null });
        window.document.removeEventListener('mousemove', this.handleMouseMove);
      }
    });
  }

  handleMouseMove = (e) => {
    const { navList, selectedItem } = this.state;

    const selectedIdx = selectedItem.idx;
    const moveY = e.clientY;
    const { length } = navList;

    const currentIdx = getCurrentIndex({ selectedIdx, moveY, length });

    const newList = getNewListWithoutHold(navList);

    newList.splice(currentIdx, 0, { name: 'hold' });

    let y = moveY - itemHeight;
    if (moveY - itemHeight > itemHeight * (navList.length - 1)) {
      y = itemHeight * (navList.length - 1);
    }

    if (moveY - itemHeight < 0) {
      y = itemHeight * 0;
    }

    this.setState({
      navList: newList,
      selectedItem: {
        ...selectedItem,
        position: {
          y,
        },
      },
    });
  };

  handleMouseDown = (e, idx) => {
    const { navList } = this.state;
    let selectedItem;
    const startY = e.clientY;
    window.startY = startY;
    const newList = navList.map((ele, _idx) => {
      if (_idx === idx) {
        selectedItem = {
          ...ele,
          idx,
          position: {
            y: itemHeight * idx,
          },
        };
        return { name: 'hold' };
      }
      return ele;
    });

    this.setState({ navList: newList, selectedItem });

    window.document.addEventListener('mousemove', this.handleMouseMove);
  };

  render() {
    const { navList, selectedItem } = this.state;
    return (
      <div style={styles.box}>
        <div style={styles.items}>
          {navList.map((item, idx) => {
            if (item.name === 'hold') {
              return (
                <div
                  key={item.name}
                  style={{
                    ...styles.item,
                    color: '#f6f9fa',
                    border: '1px dashed #ddd',
                  }}
                  onMouseDown={e => this.handleMouseDown(e, idx)}
                >
                  {item.name}
                </div>
              );
            }
            return (
              <div
                key={item.name}
                style={styles.item}
                onMouseDown={e => this.handleMouseDown(e, idx)}
              >
                {item.name}
              </div>
            );
          })}
          {selectedItem && (
            <div
              style={{
                ...styles.item,
                position: 'absolute',
                backgroundColor: '#d3eef7',
                top: selectedItem.position.y,
                boxShadow: '0px 2px 2px 0px #ddd',
              }}
            >
              {selectedItem.name}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
