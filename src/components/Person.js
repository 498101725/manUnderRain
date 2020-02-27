import React from 'react';
import '../styles/Person.css';

/**
 * @class Person
 */
class Person extends React.Component {
  constructor(props) {
    super(props);
    this.personRef = React.createRef();
    this.state = {
      left: 0
    };
  }
  walk = () => {
    this.setState({ left: this.state.left + this.props.step });
  };
  componentDidMount = () => {
    this.props.getPerson(this);
  };
  getPosition = () => {
    const personElement = this.personRef.current;
    const personPositions = personElement.getBoundingClientRect();
    const px1 = personPositions.left;
    const px2 = personPositions.right;
    const py1 = personPositions.top;
    const py2 = personPositions.bottom;

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
        className='person'
        style={{ width: width, height: height, left: this.state.left }}
        ref={this.personRef}
      ></div>
    );
  }
}
export default Person;
