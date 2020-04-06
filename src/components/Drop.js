import React from 'react';
import '../styles/Drop.css';

class Drop extends React.Component {
  constructor(props) {
    super(props);

    this.created = props.created || performance.now();

    const ground = {
      getPosition() {
        return {
          x1: 0,
          x2: window.innerWidth,
          y1: window.innerHeight,
          y2: window.innerHeight + 1000
        };
      }
    };
    this.substance = this.props.substance || [];
    this.substance.unshift(ground);
    this.state = {
      top: parseInt(Math.random() * 50),
      left: this.props.index * 2 * (this.props.radius + this.props.margin)
    };
  }

  fall = () => {
    //debugger;
    const offset =
      (Math.pow((performance.now() - this.created) / 1000, 2) * 9.8) / 2;

    this.setState({ top: this.state.top + offset });
    this.props.getTop(this.state.top);
    //console.log('：', this.state.top, offset);

    if (this.hitSomething()) {
      this.props.onDestroy();
      this.setState({
        destroyed: true
      });
      return;
    }

    requestAnimationFrame(this.fall);
  };

  hitSomething = () => {
    //debugger;
    const { dx1, dx2, dy1, dy2 } = this.getPosition();
    return this.substance.find(({ getPosition }) => {
      //   this.substance.find(substance => {
      //     const getPosition = substance.getPosition;
      const { x1, x2, y1, y2 } = getPosition();

      //   const crossY1 = y1 > dy1 && y1 < dy2;
      const betweenY = y1 < dy1 && y2 > dy2;
      const betweenX = x1 < dx1 && x2 > dx2;
      const crossX1 = x1 > dx1 && x1 < dx2;
      const crossX2 = x2 > dx1 && x2 < dx2;
      return betweenY && (betweenX || crossX1 || crossX2);
    });
  };
  componentDidMount = () => {
    this.fall();
  };
  getPosition = () => {
    const width = this.props.radius * 2;
    const height = this.props.radius * 2;
    const margin = this.props.margin;
    const dx1 = this.state.left + margin;
    const dx2 = dx1 + width;
    const dy1 = this.state.top;
    const dy2 = dy1 + height;
    return { dx1, dx2, dy1, dy2 };
  };
  render() {
    const width = this.props.radius * 2;
    const height = this.props.radius * 2;
    const margin = this.props.margin;
    return (
      <div>
        <div
          className='drop'
          style={{
            width,
            height,
            margin,
            top: this.state.top,
            left: this.state.left,
            display: this.state.destroyed ? 'none' : 'inline-block'
          }}
        ></div>
      </div>
    );
  }
}
export default Drop;
