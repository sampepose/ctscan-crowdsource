import React, {Component} from 'react';
import {Button, Col, Grid, Row} from 'react-bootstrap';
import sample from './img/sample.jpg';

import './Dash.css';

// First decision
const PLANES = ['Axial', 'Coronal', 'Sagittal'];

// Second decision
const ARM = 'Arm', LEG = 'Leg', ABOVE_CLAVICLE = 'Above the clavicle', BELOW_CLAVICLE = 'Below the clavicle';
const REGIONS = [ARM, LEG, ABOVE_CLAVICLE, BELOW_CLAVICLE];

// Third decision
const ABOVE_CLAVICLE_OPTIONS = ['Vertebrae', 'Mandible', 'Brain', 'Cranium', 'Pharynx'];
const BELOW_CLAVICLE_OPTIONS = ['Heart', 'Lung', 'Vertebrae', 'Stomach', 'Spleen', 'Kidney', 'Liver', 'Pelvis'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plane: null,
      region: null,
      features: [],
    };
    this.changePlane = this.changePlane.bind(this);
    this.changeRegion = this.changeRegion.bind(this);
    this.changeFeatures = this.changeFeatures.bind(this);
  }

  changePlane(plane) {
    this.setState({plane: plane[0]});
    this.changeRegion([null]);
    this.changeFeatures([]);
  }

  changeRegion(region) {
    this.setState({region: region[0]});
    this.changeFeatures([]);
  }

  changeFeatures(features) {
    this.setState({features});
  }

  // TODO: Load image from server
  render() {
    const showSubmit = this.state.region && ((this.state.region === ARM || this.state.region === LEG) || this.state.features.length > 0);

    return (
      <Grid>
        <Row>
          <Col xs={6}>
            <img src={sample} id="mainImg" className="center-block"/>
          </Col>
          <Col xs={6}>
            <PlaneSelection onPlaneChange={this.changePlane}/>
            <RegionSelection onRegionChange={this.changeRegion} active={[this.state.region]}/>
            {
              this.state.region &&
              this.state.region !== ARM &&
              this.state.region !== LEG &&
              <FeatureSelection
                active={this.state.features}
                features={this.state.region === ABOVE_CLAVICLE ? ABOVE_CLAVICLE_OPTIONS : BELOW_CLAVICLE_OPTIONS}
                onFeatureChange={this.changeFeatures} />
            }
            {
              showSubmit &&
              <Button
                id="submitBtn"
                className="center-block"
                bsSize="large"
                bsStyle="success"
                onClick={() => {console.log(this.state)}}>Submit</Button>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

class PlaneSelection extends Component {
  render() {
    return ( // TODO: add ? hoverover thingy
      <div>
        <h4>Plane</h4>
        <Buttons
          buttons={PLANES}
          toggle={true}
          onButtonClick={this.props.onPlaneChange} />
      </div>
    )
  }
}

class RegionSelection extends Component {
  render() {
    return ( // TODO: add ? hoverover thingy
      <div>
        <h4>Region</h4>
        <Buttons
          active={this.props.active}
          buttons={REGIONS}
          toggle={true}
          onButtonClick={this.props.onRegionChange} />
      </div>
    )
  }
}

class FeatureSelection extends Component {
  render() {
    return (
      <div>
        <h4>Features</h4>
        <Buttons
          active={this.props.active}
          buttons={this.props.features}
          onButtonClick={this.props.onFeatureChange} />
      </div>
    );
  }
}

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active || [],
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.active !== undefined) {
      this.setState({active: newProps.active});
    }
  }

  onButtonClick(e, value) {
    let newState = null;
    if (this.props.toggle) {
      newState = [value];
    } else {
      const idx = this.state.active.indexOf(value);
      if (idx === -1) {
        newState = this.state.active.slice().concat(value);
      } else {
        newState = this.state.active.slice();
        newState.splice(idx, 1);
      }
    }
    this.setState({
      active: newState,
    });
    this.props.onButtonClick && this.props.onButtonClick(newState);
  }

  render() {
    return (
      <div>
        {
          this.props.buttons.map(b => {
            return <Button
              active={this.state.active.indexOf(b) !== -1}
              bsSize="large"
              bsStyle={this.state.active.indexOf(b) !== -1 ? 'primary' : 'default'}
              key={b}
              onClick={e => {this.onButtonClick(e, b)}}>
              {b}
            </Button>
          })
        }
      </div>
    );
  }
}

Buttons.propTypes = {
  active: React.PropTypes.arrayOf(React.PropTypes.string), // what is currently active?
  buttons: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  toggle: React.PropTypes.bool,
  vertical: React.PropTypes.bool, // TODO: Implement with CSS
  onButtonClick: React.PropTypes.func,
}

export default App;
