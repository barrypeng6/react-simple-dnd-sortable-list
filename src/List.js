import React from 'react';
import Item from './Item';

const itemHeight = 32;

const styles = {
  list: {
    margin: '20px 30px',
    position: 'relative',
    backgroundColor: '#f6f9fa',
    overflow: 'hidden',
    borderRadius: 4,
    width: 100,
  },
  item: {
    width: 100,
    height: itemHeight,
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const getCurrentIndex = ({ selectedIdx, moveY, length }) => {
  const startTop = itemHeight * selectedIdx;
  const presentTop = startTop + (moveY - window.startY);
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

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
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

    const startTop = itemHeight * selectedIdx;

    let y = startTop + (moveY - window.startY);
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
      <div style={styles.list}>
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
              >
                {item.name}
              </div>
            );
          }
          return (
            <Item
              name={item.name}
              height={itemHeight}
              onMouseDown={e => this.handleMouseDown(e, idx)}
            />
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
    );
  }
}
