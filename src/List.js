import React from 'react';
import Item from './Item';

const ROW = 'row';
const COLUMN = 'column';


const itemHeight = 32;
const itemWidth = 100;

const styles = {
  list: {
    margin: '20px 30px',
    position: 'relative',
    backgroundColor: '#f6f9fa',
    overflow: 'hidden',
    borderRadius: 4,
    display: 'flex',
  },
  item: {
    width: itemWidth,
    height: itemHeight,
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const getCurrentIndex = ({
  selectedIdx,
  moveX,
  moveY,
  length,
}) => {
  if (moveY) {
    const startTop = itemHeight * selectedIdx;
    const presentTop = startTop + (moveY - window.startY);
    let currentIdx = Math.ceil((presentTop - itemHeight / 2) / itemHeight);
    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx > length - 1) currentIdx = length - 1;
    return currentIdx;
  }
  const startLeft = itemWidth * selectedIdx;
  const presentLeft = startLeft + (moveX - window.startX);
  let currentIdx = Math.ceil((presentLeft - itemWidth / 2) / itemWidth);
  if (currentIdx < 0) currentIdx = 0;
  if (currentIdx > length - 1) currentIdx = length - 1;
  return currentIdx;
};

const getNewListWithoutHold = (datalist) => {
  const newList = datalist.reduce((ls, ele) => {
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
    const { direction, datalist, selectedItem } = this.props;
    this.state = {
      direction,
      datalist,
      selectedItem,
    };
  }

  componentDidMount() {
    window.document.addEventListener('mouseup', (e) => {
      const { direction, datalist, selectedItem } = this.state;
      if (direction === COLUMN) {
        if (selectedItem) {
          const selectedIdx = selectedItem.idx;
          const moveY = e.clientY;
          const { length } = datalist;
          const currentIdx = getCurrentIndex({ selectedIdx, moveY, length });
          const newList = getNewListWithoutHold(datalist);
          newList.splice(currentIdx, 0, { name: selectedItem.name });
          this.setState({ datalist: newList, selectedItem: null });
          window.document.removeEventListener('mousemove', this.handleMouseMove);
        }
      } else if (selectedItem) {
        const selectedIdx = selectedItem.idx;
        const moveX = e.clientX;
        const { length } = datalist;
        const currentIdx = getCurrentIndex({ selectedIdx, moveX, length });
        const newList = getNewListWithoutHold(datalist);
        newList.splice(currentIdx, 0, { name: selectedItem.name });
        this.setState({ datalist: newList, selectedItem: null });
        window.document.removeEventListener('mousemove', this.handleMouseMove);
      }
    });
  }

  handleMouseMove = (e) => {
    const { direction, datalist, selectedItem } = this.state;
    const selectedIdx = selectedItem.idx;
    const { length } = datalist;
    if (direction === COLUMN) {
      const moveY = e.clientY;
      const currentIdx = getCurrentIndex({ selectedIdx, moveY, length });
      const newList = getNewListWithoutHold(datalist);
      newList.splice(currentIdx, 0, { name: 'hold' });

      const startTop = itemHeight * selectedIdx;

      let y = startTop + (moveY - window.startY);
      if (moveY - itemHeight > itemHeight * (datalist.length - 1)) {
        y = itemHeight * (datalist.length - 1);
      }

      if (moveY - itemHeight < 0) {
        y = itemHeight * 0;
      }

      this.setState({
        datalist: newList,
        selectedItem: {
          ...selectedItem,
          position: {
            y,
          },
        },
      });
    } else {
      const moveX = e.clientX;
      const currentIdx = getCurrentIndex({ selectedIdx, moveX, length });
      const newList = getNewListWithoutHold(datalist);
      newList.splice(currentIdx, 0, { name: 'hold' });

      const startLeft = itemWidth * selectedIdx;

      let x = startLeft + (moveX - window.startX);
      if (moveX - itemWidth > itemWidth * (datalist.length - 1)) {
        x = itemWidth * (datalist.length - 1);
      }

      if (moveX - itemWidth < 0) {
        x = itemWidth * 0;
      }

      this.setState({
        datalist: newList,
        selectedItem: {
          ...selectedItem,
          position: {
            x,
          },
        },
      });
    }
  };

  handleMouseDown = (e, idx) => {
    const { direction, datalist } = this.state;
    let selectedItem;
    if (direction === COLUMN) {
      const startY = e.clientY;
      window.startY = startY;
      const newList = datalist.map((ele, _idx) => {
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
      this.setState({ datalist: newList, selectedItem });
    } else {
      const startX = e.clientX;
      window.startX = startX;
      const newList = datalist.map((ele, _idx) => {
        if (_idx === idx) {
          selectedItem = {
            ...ele,
            idx,
            position: {
              x: itemWidth * idx,
            },
          };
          return { name: 'hold' };
        }
        return ele;
      });
      this.setState({ datalist: newList, selectedItem });
    }

    window.document.addEventListener('mousemove', this.handleMouseMove);
  };

  render() {
    const { direction, datalist, selectedItem } = this.state;
    return (
      <div style={{ ...styles.list, flexDirection: direction }}>
        {datalist.map((item, idx) => {
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
              key={item.name}
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
              top: direction === COLUMN ? selectedItem.position.y : 0,
              left: direction === ROW ? selectedItem.position.x : 0,
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
