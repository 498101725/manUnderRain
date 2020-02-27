import React from 'react';
import '../styles/Drop.css';

class Drop extends React.Component {
  constructor(props) {
    super(props);
    this.dropRef = React.createRef();
    this.state = {
      top: this.props.top || 0,
      left: props.index * (this.props.radius + this.props.margin)
    };
  }
  fall = now => {
    //offset 解释
    const offset = (Math.pow((now - this.props.created) / 1000, 2) * 9.8) / 2;
    this.setState({ top: this.state.top + offset });
  };
  componentDidMount = () => {
    this.props.ready(this);
  };
  getPosition = () => {
    const dropElement = this.dropRef.current;
    const dropPosition = dropElement.getBoundingClientRect();
    const dx1 = dropPosition.left;
    const dx2 = dropPosition.right;
    const dy1 = dropPosition.top;
    const dy2 = dy1 - this.props.radius * 2;
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
          ref={this.dropRef}
          style={{
            width: width,
            height: height,
            margin,
            top: this.state.top,
            left: this.state.left
          }}
        ></div>
      </div>
    );
  }
}
export default Drop;
