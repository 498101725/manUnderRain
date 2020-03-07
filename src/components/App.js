import React from 'react';
import '../styles/App.css';
import SplitPane, { Pane } from 'react-split-pane';
import Person from './Person';
import Drop from './Drop';
import Slider, { Range } from 'rc-slider';
import 'bulma/css/bulma.min.css';
import 'rc-slider/assets/index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.drops = [];
    this.state = {
      screenSize: 880,
      personHeight: 300,
      personWidth: 40,
      personStep: 3,
      rainMargin: 5,
      rainRadius: 10,
      generateInterval: 1000,
      dropsJSX: []
    };
  }

  // componentDidMount只在render挂载完毕后被调用一次，不管function body里面有什么；
  componentDidMount = () => {
    //debugger;
    this.launchRainingThread();
    //debugger;
    this.launchDropThread();
    // debugger;
    this.startWalking();
  };
  startWalking = () => {
    const walking = () => {
      if (this.personWalkedBy()) {
        return;
      }
      if (this.isWalking == true) {
        this.person.walk();
      }

      window.requestAnimationFrame(walking);
    };
    window.requestAnimationFrame(walking);
  };

  drawDropline = (top, moment) => {
    const dropNumPerLine = this.dropNumEachLine(
      this.state.screenSize,
      this.state.rainMargin,
      this.state.rainRadius
    );
    let dropJSX = [];
    const dropLine = [];
    this.drops.push(dropLine);
    for (let i = 0; i < dropNumPerLine; i++) {
      // debugger;
      dropJSX.push(
        <Drop
          index={i * 2}
          key={i}
          created={moment}
          top={Math.random(top) * 5500}
          radius={parseInt(Math.random() * this.state.rainRadius + 3)}
          margin={this.state.rainMargin}
          ready={drop => {
            dropLine.push(drop);
          }}
        />
      );
    }
    this.state.dropsJSX.push(dropJSX);
  };

  dropNumEachLine = (screenSize, margin, radius) => {
    const space = screenSize / (margin * 2 + radius * 2);
    return space;
  };

  launchRainingThread = () => {
    const createDropLine = () => {
      if (this.isRaining) {
        //debugger;
        this.drawDropline(0, performance.now());
      }
      window.setTimeout(createDropLine, this.state.generateInterval);
    };
    createDropLine();
  };

  launchDropThread = () => {
    const toDrop = () => {
      if (this.personWalkedBy()) {
        return;
      }
      if (!this.isRaining) {
        //
        window.requestAnimationFrame(toDrop);
        return;
      }
      const now = performance.now();
      this.drops.forEach((line, rowIndex) => {
        line.forEach((drop, colIndex) => {
          if (this.isDropOnPerson(drop) || this.isDropOnGround(drop)) {
            line.splice(
              line.findIndex(d => {
                return d === drop;
              }),
              1
            );
            this.state.dropsJSX[rowIndex].splice(
              this.state.dropsJSX[rowIndex].findIndex(d => {
                return d === this.state.dropsJSX[rowIndex][colIndex];
              }),
              1
            );
          }
          drop.fall(now);
        });
      });
      // this.drops重新等一下
      this.drops = this.drops.filter((_, index) => {
        // debugger;
        return this.state.dropsJSX[index].length;
      });
      this.setState({
        dropsJSX: this.state.dropsJSX.filter(dropJSX => {
          return dropJSX.length;
        })
      });
      window.requestAnimationFrame(toDrop);
    };
    window.requestAnimationFrame(toDrop);
  };
  isDropOnPerson = drop => {
    const { px1, px2, py1 } = this.person.getPosition();

    const { dx1, dx2, dy1, dy2 } = drop.getPosition();
    const heightComparison = dy1 > py1 && py1 > dy2;
    if (
      (dx1 < px1 && px1 < dx2 && heightComparison) ||
      (dx1 > px1 && dx2 < px2 && heightComparison) ||
      (dx1 < px2 && dx2 > px2 && heightComparison)
    ) {
      return true;
    } else {
      return false;
    }
  };
  isDropOnGround = drop => {
    const { dx2 } = drop.getPosition();
    if (dx2 >= this.availableSpace) {
      return true;
    } else {
      return false;
    }
  };

  personWalkedBy = () => {
    const { px1 } = this.person.getPosition();
    if (px1 > window.innerWidth) {
      return true;
    } else {
      return false;
    }
  };

  onRainSizeChange = rainRadius => {
    this.setState({ rainRadius: rainRadius });
  };
  onPersonHeightChange = height => {
    this.setState({ personHeight: height });
  };
  onPersonWidthChange = width => {
    this.setState({ personWidth: width });
  };
  onRainMarginChange = margin => {
    this.setState({ rainMargin: margin });
  };

  onPersonWalk = ref => {
    this.person = ref;
  };

  render() {
    return (
      <div>
        <SplitPane
          split='vertical'
          minSize={100}
          maxSize={1000}
          defaultSize={this.state.screenSize}
        >
          <div>
            <div>{this.state.dropsJSX}</div>
            <div>
              <Person
                getPerson={this.onPersonWalk}
                height={this.state.personHeight}
                width={this.state.personWidth}
                step={this.state.personStep}
              />
            </div>
          </div>
          <div>
            <div>
              <p>Rain Size(Radius)</p>
              <Slider
                min={2}
                max={6}
                defaultValue={this.state.rainRadius}
                onChange={this.onRainSizeChange}
              />
            </div>
            <div>
              <p>Rain Margin</p>
              <Slider
                min={2}
                max={8}
                defaultValue={this.state.rainMargin}
                onChange={this.onRainMarginChange}
              />
            </div>
            <div>
              <p>Person Height</p>
              <Slider
                min={168}
                max={350}
                defaultValue={this.state.personHeight}
                onChange={this.onPersonHeightChange}
              />
            </div>
            <div>
              <p>Person Width</p>
              <Slider
                min={10}
                max={45}
                defaultValue={this.state.personWidth}
                onChange={this.onPersonWidthChange}
              />
            </div>
            <div className='section'>
              <div className='buttons has-addons'>
                <button className='button'>Rain</button>
                <button
                  className='button is-info'
                  onClick={() => (this.isRaining = true)}
                >
                  Fall
                </button>
                <button
                  className='button is-danger'
                  onClick={() => (this.isRaining = false)}
                >
                  Stop
                </button>
              </div>
              <div className='buttons has-addons'>
                <button className='button'>Person</button>
                <button
                  className='button is-info'
                  onClick={() => {
                    this.isWalking = true;
                  }}
                >
                  Walk
                </button>
                <button
                  className='button is-danger'
                  onClick={() => {
                    this.isWalking = false;
                  }}
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        </SplitPane>
      </div>
    );
  }
}
export default App;
