import React from 'react';
import '../styles/Person.css';

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.personRef = React.createRef();
    //debugger;
    this.state = {
      left: 0,
      step: 50
    };
  }
  walk = () => {
    if (this.isWalking) {
      const distance =
        (this.state.step * (performance.now() - this.lastMoment)) / 1000;

      // debugger;
      this.setState({
        left: this.state.left + distance
      });
      const { x2 } = this.getPosition();
      if (x2 > this.props.screenLength) {
        const extraDistance = x2 - this.props.screenLength;
        this.setState({
          left: this.state.left - extraDistance
        });
      }
    }
    this.lastMoment = performance.now();

    const walking = window.requestAnimationFrame(this.walk);

    if (this.reachedEnd()) {
      window.cancelAnimationFrame(walking);
    }
  };
  running = () => {
    if ((this.isWalking = true)) {
      const runningStep = this.state.step * 5;
      this.setState({ step: runningStep });
    }
  };

  start = () => {
    this.isWalking = true;
  };
  stop = () => {
    this.isWalking = false;
  };
  reachedEnd = () => {
    const { x2 } = this.getPosition();
    return x2 > this.props.screenLength || x2 === this.props.screenLength;
  };

  componentDidMount = () => {
    this.props.onCreated(this);
    this.walk();
  };
  getPosition = () => {
    const personElement = this.personRef.current;
    const personPositions = personElement.getBoundingClientRect();
    const x1 = personPositions.left;
    const x2 = personPositions.right;
    const y1 = personPositions.top;
    const y2 = personPositions.bottom;
    return {
      x1,
      x2,
      y1,
      y2
    };
  };
  render() {
    const width = this.props.width;
    const height = this.props.height;
    return (
      <div
        className='person'
        style={{ width: width, height: height, left: this.state.left }}
        ref={this.personRef}
      ></div>
    );
  }
}
export default Person;
