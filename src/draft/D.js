import React from 'react';
import '../styles/Drop.css';

class Drop extends React.Component {
  constructor(props) {
    super(props);
    this.dropRef = React.createRef();
    this.created = props.created || 0;
    this.state = {
      top: props.top || 0,
      left: props.index * (this.props.radius + this.props.margin)
    };
  }
  componentDidMount = () => {
    this.props.ready(this);
  };
  getPosition = () => {
    const dropElement = this.dropRef.current;
    const dropPosition = dropElement.getBoundingClientRect();
    const dx1 = dropPosition.left;
    const dx2 = dropPosition.right;
    const dy1 = dropPosition.top;
    const dy2 = dropPosition.bottom;
    return { dx1, dx2, dy1, dy2 };
  };
  render() {
    const width = this.props.radius * 2;
    const height = this.props.radius * 2;
    const margin = this.props.margin;
    return (
      <div
        ref={this.dropRef}
        className='drop'
        style={{
          width: width,
          height: height,
          margin: margin,
          top: this.state.top,
          left: this.state.left
        }}
      ></div>
    );
  }
  fall = now => {
    //debugger;
    const offset = (Math.pow((now - this.created) / 1000, 2) * 9.8) / 2;
    this.setState({ top: this.state.top + offset });
  };
}
export default Drop;
