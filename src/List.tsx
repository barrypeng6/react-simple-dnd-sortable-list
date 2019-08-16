import React, { CSSProperties } from 'react';
import Item from './Item';
import { IMockData } from './App';

interface IClientWindow extends Window {
  startX: number;
  startY: number;
}

declare const window: IClientWindow;


const ROW = 'row';
const COLUMN = 'column';


const itemHeight = 32;
const itemWidth = 100;

const listStyle: CSSProperties = {
  margin: '20px 30px',
  position: 'relative',
  backgroundColor: '#f6f9fa',
  overflow: 'hidden',
  borderRadius: 4,
  display: 'flex',
}

const itemStyle: CSSProperties = {
  width: itemWidth,
  height: itemHeight,
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

interface IgetCurrentIndex {
  isColumn: boolean;
  selectedIdx: number;
  move: number;
  length: number;
}

const getCurrentIndex = ({
  isColumn,
  selectedIdx,
  move,
  length,
}: IgetCurrentIndex) => {    
  if (isColumn) {
    const startTop = itemHeight * selectedIdx;
    const presentTop = startTop + (move - window.startY);
    let currentIdx = Math.ceil((presentTop - itemHeight / 2) / itemHeight);
    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx > length - 1) currentIdx = length - 1;
    return currentIdx;
  } else {
    const startLeft = itemWidth * selectedIdx;
    const presentLeft = startLeft + (move - window.startX);
    let currentIdx = Math.ceil((presentLeft - itemWidth / 2) / itemWidth);
    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx > length - 1) currentIdx = length - 1;
    return currentIdx;
  }
};

const getNewListWithoutHold = (datalist: IMockData[]) => {
  const newList = datalist.reduce((ls: IMockData[], ele) => {
    if (ele.name === 'hold') {
      return ls;
    }
    return ls.concat(ele);
  }, []);
  return newList;
};

interface IProps {
  direction: 'column' | 'row';
  datalist: IMockData[];
  selectedItem: IMockData | null;
}

interface IState {
  datalist: IMockData[];
  selectedItem: IMockData | null;
  idx: number;
  position: { x?: number; y?: number };
}

export default class extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { datalist, selectedItem } = this.props;
    this.state = {
      datalist,
      selectedItem,
      idx: 0,
      position: {},
    };
  }

  componentDidMount() {
    window.document.addEventListener('mouseup', (e) => {
      const { datalist, selectedItem, idx } = this.state;
      if (selectedItem) {
        const selectedIdx = idx;
        const move = this.props.direction === COLUMN ? e.clientY : e.clientX;
        const { length } = datalist;
        const currentIdx = getCurrentIndex({ isColumn: this.props.direction === COLUMN, selectedIdx, move, length });
        const newList = getNewListWithoutHold(datalist);
        newList.splice(currentIdx, 0, { name: selectedItem.name });
        this.setState({ datalist: newList, selectedItem: null,  idx: 0, position: {} });
        window.document.removeEventListener('mousemove', this.handleMouseMove);
      }
    });
  }

  handleMouseMove = (e: any) => {
    const { datalist, idx } = this.state;
    const selectedIdx = idx;
    const { length } = datalist;
    if (this.props.direction === COLUMN) {
      const move = e.clientY;
      const currentIdx = getCurrentIndex({ isColumn: true, selectedIdx, move, length });
      const newList = getNewListWithoutHold(datalist);
      newList.splice(currentIdx, 0, { name: 'hold' });

      const startTop = itemHeight * selectedIdx;

      let y = startTop + (move - window.startY);
      if (move - itemHeight > itemHeight * (datalist.length - 1)) {
        y = itemHeight * (datalist.length - 1);
      }

      if (move - itemHeight < 0) {
        y = itemHeight * 0;
      }

      this.setState({
        datalist: newList,
        position: { y },
      });
    } else {
      const move = e.clientX;
      const currentIdx = getCurrentIndex({ isColumn: false, selectedIdx, move, length });
      const newList = getNewListWithoutHold(datalist);
      newList.splice(currentIdx, 0, { name: 'hold' });

      const startLeft = itemWidth * selectedIdx;

      let x = startLeft + (move - window.startX);
      if (move - itemWidth > itemWidth * (datalist.length - 1)) {
        x = itemWidth * (datalist.length - 1);
      }

      if (move - itemWidth < 0) {
        x = itemWidth * 0;
      }

      this.setState({
        datalist: newList,
        position: { x },
      });
    }
  };

  handleMouseDown = (e: any, idx: number) => {
    const { datalist } = this.state;
    let newSelectedItem: IMockData | null = this.state.selectedItem;
    if (this.props.direction === COLUMN) {
      const startY = e.clientY;
      window.startY = startY;
      const newList = datalist.map((ele, _idx) => {
        if (_idx === idx) {
          newSelectedItem = ele;
          return { name: 'hold' };
        }
        return ele;
      });
      this.setState({ datalist: newList, selectedItem: newSelectedItem, idx, position: { y: itemHeight * idx } });
    } else {
      const startX = e.clientX;
      window.startX = startX;
      const newList = datalist.map((ele, _idx) => {
        if (_idx === idx) {
          newSelectedItem = ele;
          return { name: 'hold' };
        }
        return ele;
      });
      this.setState({ datalist: newList, selectedItem: newSelectedItem, idx, position: { x: itemWidth * idx } });
    }

    window.document.addEventListener('mousemove', this.handleMouseMove);
  };

  render() {
    const { datalist, selectedItem, position } = this.state;
    return (
      <div style={{ ...listStyle, flexDirection: this.props.direction }}>
        {datalist.map((item, idx) => {
          if (item.name === 'hold') {
            return (
              <div
                key={item.name}
                style={{
                  ...itemStyle,
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
              ...itemStyle,
              position: 'absolute',
              backgroundColor: '#d3eef7',
              top: this.props.direction === COLUMN ? position.y : 0,
              left: this.props.direction === ROW ? position.x : 0,
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
