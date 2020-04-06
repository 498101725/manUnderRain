import React from 'react';
import '../styles/App.css';
import SplitPane from 'react-split-pane';
import Person from './Person';
import Drop from './Drop';
import Slider from 'rc-slider';
import 'bulma/css/bulma.min.css';
import 'rc-slider/assets/index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenLength: 880,
      personHeight: 200,
      personWidth: 35,
      personStep: 50,
      rainMargin: 15,
      rainRadius: 8,
      generateInterval: 500,
      dropsJSX: [],
      top: 0,
      destroyedDropNumber: 0
    };
  }

  drawDropline = () => {
    const dropNumPerLine = this.getNumPerLine(
      this.state.screenLength,
      this.state.rainMargin,
      this.state.rainRadius
    );

    const row = this.state.dropsJSX.push([]) - 1;
    const moment = performance.now();

    for (let col = 0; col < dropNumPerLine; col++) {
      this.drawDrop(row, col, moment);
    }
    this.setState({
      dropsJSX: this.state.dropsJSX
    });
  };

  changeTopValue = top => {
    this.setState({ top: top });
  };

  drawDrop = (row, col, moment) => {
    if (Math.random() < 0.3) {
      return;
    }

    const dropIdentity = this.state.dropsJSX[row].length;

    this.state.dropsJSX[row].push(
      <Drop
        getTop={this.changeTopValue}
        key={dropIdentity}
        index={col}
        created={moment}
        radius={this.state.rainRadius}
        margin={this.state.rainMargin}
        substance={[this.person]}
        onDestroy={() => {
          const dropHeight = this.state.rainRadius * 2;
          const dropBottom = this.state.top + dropHeight;
          if (dropBottom < window.innerHeight) {
            this.setState({
              destroyedDropNumber: this.state.destroyedDropNumber + 1
            });
          }
          const line = this.state.dropsJSX[row];
          const target = line.findIndex(({ key }) => {
            return parseInt(key) === dropIdentity;
          });
          if (target !== -1) {
            line.splice(target, 1);
          }
        }}
      />
    );
  };

  getNumPerLine = (screenLength, margin, radius) => {
    const space = screenLength / (margin * 2 + radius * 2);
    return Math.floor(space);
  };

  startRaining = () => {
    const createDropLine = () => {
      this.drawDropline();
      this.toCreateDrops = window.setTimeout(
        createDropLine,
        this.state.generateInterval
      );
    };
    createDropLine();
  };

  stopRaining = () => {
    clearTimeout(this.toCreateDrops);
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

  onPersonReady = ref => {
    this.person = ref;
  };

  rainAndWalk = () => {
    setTimeout(() => {
      this.person.start();
    }, 4000);
    this.startRaining();
  };
  stopRainAndWalk = () => {
    setTimeout(() => {
      this.person.stop();
    }, 2800);
    this.stopRaining();
  };
  rainAndRun = () => {
    setTimeout(() => {
      this.person.running();
    }, 4000);
    this.startRaining();
  };
  render() {
    return (
      <div>
        <SplitPane
          split='vertical'
          minSize={100}
          defaultSize={this.state.screenLength}
        >
          <div>
            <div>{this.state.dropsJSX}</div>
            <div>
              <Person
                screenLength={this.state.screenLength}
                onCreated={this.onPersonReady}
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
                min={10}
                max={30}
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
                <button
                  className='button is-info'
                  onClick={() => this.rainAndWalk()}
                >
                  Start
                </button>
                <button
                  className='button is-success'
                  onClick={() => this.rainAndRun()}
                >
                  Running
                </button>
                <button
                  className='button is-danger'
                  onClick={() => this.stopRainAndWalk()}
                >
                  Stop
                </button>

                <button className='button is-info'> Drops Gone</button>
                <button className='button is-warning'>
                  {this.state.destroyedDropNumber}
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
