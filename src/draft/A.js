import React from 'react';
import '../styles/App.css';
import SplitPane from 'react-split-pane';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Person from './Person';
import Drop from './Drop';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.drops = [];
    this.state = {
      screenSize: 800,
      personWidth: 30,
      personHeight: 195,
      personStep: 20,
      rainRadius: 3,
      rainMargin: 10,
      dropJSX: []
    };
  }

  componentDidMount = () => {
    this.fullfillDrops();
    this.startRaining();
    this.startWalking();
  };

  isPersonAtEnd = () => {
    const { px2 } = this.person.getPosition();
    return px2 > window.width;
  };

  fullfillDrops = () => {
    //debugger;
    const now = performance.now();
    const fps = 140 / 1000;
    const availableSpace = window.innerHeight - this.state.rainRadius * 4;
    let top = 0;
    let duration = 0;
    const dropsJSX = [];
    while (top <= availableSpace) {
      dropsJSX.push(this.createDropLine(top, now + duration));
      duration += fps;
      top += (Math.pow(duration, 2) * 9.8) / 2;
    }
    this.setState({ dropJSX: dropsJSX });
  };

  startRaining = () => {
    //debugger;
    const toDrop = () => {
      if (this.isPersonAtEnd()) {
        return;
      }
      const now = performance.now();
      this.drops.forEach((line, rowIndex) => {
        line.forEach((dropInLine, colIndex) => {
          if (
            this.isDropOnPerson(dropInLine) ||
            this.isDropOnGroud(dropInLine)
          ) {
            line.splice(
              line.findIndex(drop => {
                return drop === dropInLine;
              }),
              1
            );

            this.state.dropJSX[rowIndex].splice(
              this.state.dropJSX[rowIndex].findIndex(drop => {
                return drop === this.state.dropJSX[rowIndex][colIndex];
              }),
              1
            );
            return;
          }
          dropInLine.fall(now);
        });
      });
      this.drops = this.drops.filter(line => {
        return line.length;
      });

      this.setState({
        dropJSX: this.state.dropJSX.filter(line => {
          return line.length;
        })
      });
      window.requestAnimationFrame(toDrop);
    };
    window.requestAnimationFrame(toDrop);
  };

  startWalking = () => {
    //debugger;
    const toWalk = () => {
      if (this.isPersonAtEnd()) {
        return;
      }
      this.person.walk();
      window.requestAnimationFrame(toWalk);
    };
    window.requestAnimationFrame(toWalk);
  };

  onPersonCreated = person => {
    this.person = person;
  };

  createDropLine = (top, moment) => {
    const dropNumPerLine = this.computeDropNumberPerLine(
      this.state.screenSize,
      this.state.rainMargin,
      this.state.rainRadius
    );

    const lineJSX = [];
    this.drops.push([]);
    for (let i = 0; i < dropNumPerLine; i++) {
      lineJSX.push(
        <Drop
          key={i}
          radius={this.state.rainRadius}
          top={top}
          margin={this.state.rainMargin}
          index={i}
          created={moment}
          ready={drop => {
            //debugger;
            this.drops[0].push(drop);
          }}
        />
      );
    }
    return lineJSX;
  };

  isDropOnPerson = drop => {
    const { px1, px2, py1 } = this.person.getPosition();
    const { dx1, dx2, dy1, dy2 } = drop.getPosition();

    const isRainSameHeightWithPerson = (dy1 > py1) & (py1 > dy2);

    if (dy2 <= 10) {
      return true;
    } else if (
      (dx1 < px1) & (dx2 > px1) & isRainSameHeightWithPerson ||
      (dx1 > px1) & (dx2 < px2) & isRainSameHeightWithPerson ||
      (dx1 < px2) & (px2 < dx2) & isRainSameHeightWithPerson
    ) {
      return true;
    } else {
      return false;
    }
  };

  isDropOnGroud = drop => {
    const { dy2 } = drop.getPosition();
    return dy2 >= window.innerHeight - this.state.rainRadius * 4;
  };

  computeDropNumberPerLine = (screenSize, margin, radius) => {
    const number = screenSize / (margin + radius);
    return parseInt(number);
  };
  changeRainSize = radius => {
    this.setState({ rainRadius: radius });
  };

  changeRainMargin = margin => {
    this.setState({ rainMargin: margin });
  };

  changeScreenSize = width => {
    this.setState({
      screenSize: width
    });
  };
  render() {
    return (
      <div>
        <SplitPane
          split='vertical'
          minSiz={100}
          maxSize={900}
          defaultSize={this.state.screenSize}
          onChange={this.changeScreenSize}
        >
          <div className='drop-container'>
            <div>{this.state.dropJSX}</div>
            <div>
              <Person
                ready={this.onPersonCreated}
                width={this.state.personWidth}
                height={this.state.personHeight}
                step={this.state.personStep}
              />
            </div>
          </div>
          <div>
            <p>Rain Radius(Size)</p>
            <Slider
              min={1}
              max={5}
              defaultValue={this.state.rainRadius}
              onChange={this.changeRainSize}
            />

            <p>Rain Margin</p>
            <Slider
              min={1}
              max={15}
              defaultValue={this.state.rainMargin}
              onChange={this.changeRainMargin}
            />

            <p>Person Hight</p>
            <Slider
              min={160}
              max={200}
              defaultValue={this.state.personHeight}
            />

            <p>Person Width</p>
            <Slider min={15} max={40} defaultValue={this.state.personWidth} />
          </div>
        </SplitPane>
      </div>
    );
  }
}
export default App;
