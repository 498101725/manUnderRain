import React from 'react';
import '../styles/Person.css';

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.personRef = React.createRef();
    this.state = {
      left: 0
    };
  }
  componentDidMount = () => {
    this.props.ready(this);
  };

  walk = () => {
    this.setState({ left: this.state.left + this.props.step });
  };

  getPosition = () => {
    const personElement = this.personRef.current;
    const pPosition = personElement.getBoundingClientRect();
    const px1 = pPosition.left;
    const px2 = pPosition.right;
    const py1 = pPosition.top;
    const py2 = pPosition.bottom;
    return {
      px1,
      px2,
      py1,
      py2
    };
  };

  render() {
    const width = this.props.width;
    const height = this.props.height;
    return (
      <div
        ref={this.personRef}
        className='person'
        style={{
          width: width,
          height: height,
          left: this.state.left
        }}
      ></div>
    );
  }
}
export default Person;
