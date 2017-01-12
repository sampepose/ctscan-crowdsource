import React, {Component} from 'react';
import {Alert, Button, Col, Glyphicon, Grid, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {PLANES, REGIONS, FEATURES} from '../config.js';

import './Dash.css';

const SERVER_ERROR = Symbol(), NO_MORE_IMAGES = Symbol();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI: null,
      imageID: null,
      errorStatus: null,
      plane: null,
      region: null,
      features: [],
    };
    this.changePlane = this.changePlane.bind(this);
    this.changeRegion = this.changeRegion.bind(this);
    this.changeFeatures = this.changeFeatures.bind(this);
    this.resetErrorStatus = this.resetErrorStatus.bind(this);
    this.loadNextImage = this.loadNextImage.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.loadNextImage();
  }

  loadNextImage() {
    fetch('/api/image/next', {
      credentials: 'include',
      method: 'GET',
    })
    .then(data => {
      switch (data.status) {
        case 200:
          return data.json();
        case 401:
          localStorage.setItem('loggedIn', null);
          browserHistory.push('/login');
          throw new Error();
        case 404:
          this.setState({
            errorStatus: NO_MORE_IMAGES,
          });
          throw new Error();
        case 500:
          this.setState({
            errorStatus: SERVER_ERROR,
          });
          throw new Error();
      }
    })
    .then(data => {
      this.setState({
        imageURI: `images/${data.uri}`,
        imageID: data._id,
      });
    })
    .catch(err => {
      console.error(err);
      this.setState({
        imageURI: null,
        imageID: null,
      });
    });
  }

  changePlane(plane) {
    this.setState({plane: plane[0]});
    this.changeRegion([]);
    this.changeFeatures([]);
  }

  changeRegion(region) {
    this.setState({region: region[0]});
    this.changeFeatures([]);
  }

  changeFeatures(features) {
    this.setState({features});
  }

  resetErrorStatus() {
    this.setState({
      errorStatus: null,
    });
  }

  submit() {
    console.log(this.state);
    let features;
    if (this.state.plane.isFeature) {
      features = [];
    } else if (this.state.region.isFeature) {
      features = [this.state.region];
    } else {
      features = this.state.features;
    }

    fetch('/api/label', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: this.state.imageID,
        features: features.map(f => f.label),
        plane: this.state.plane.label,
      }),
    })
    .then(data => {
      switch (data.status) {
        case 200:
          return data.json();
        case 401:
          localStorage.setItem('loggedIn', null);
          browserHistory.push('/login');
          throw new Error();
        case 404:
          this.setState({
            errorStatus: NO_MORE_IMAGES,
            plane: null,
            region: null,
            features: [],
          });
          throw new Error();
        case 500:
          this.setState({
            errorStatus: SERVER_ERROR,
          });
          throw new Error();
      }
    })
    .then(data => {
      this.setState({
        imageURI: `images/${data.uri}`,
        imageID: data._id,
        errorStatus: null,
        plane: null,
        region: null,
        features: [],
      });
    })
    .catch(err => {
      console.error(err);
      this.setState({
        imageURI: null,
        imageID: null,
      });
    });
  }

  render() {
    const showSubmit = (this.state.plane && this.state.plane.isFeature) ||
      (this.state.region && this.state.region.isFeature) ||
      this.state.features.length > 0;

    return (
      <Grid>
        <Row>
          <Col xs={12}>
          {
            this.state.errorStatus === SERVER_ERROR &&
            <Alert bsStyle="danger" onDismiss={this.resetErrorStatus}>
              <h4>Server Error</h4>
              <p>Unable to perform action. Please refresh the page and try again.</p>
            </Alert>
          }
          {
            this.state.errorStatus === NO_MORE_IMAGES &&
            <Alert bsStyle="info" onDismiss={this.resetErrorStatus}>
              <h4>No More Images</h4>
              <p>You have labeled all available images.</p>
            </Alert>
          }
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            {
              this.state.imageURI &&
              <img src={this.state.imageURI} id="mainImg" className="center-block" alt="scan to label"/>
            }
          </Col>
          <Col xs={6}>
            {
              this.state.imageURI &&
              <PlaneSelection onPlaneChange={this.changePlane} active={[this.state.plane]}/>
            }
            {
              this.state.plane &&
              !this.state.plane.isFeature &&
              <RegionSelection onRegionChange={this.changeRegion} active={[this.state.region]}/>
            }
            {
              this.state.region &&
              !this.state.region.isFeature &&
              <FeatureSelection
                active={this.state.features}
                features={this.state.region.features}
                onFeatureChange={this.changeFeatures} />
            }
            {
              showSubmit &&
              <Button
                id="submitBtn"
                className="center-block"
                bsSize="large"
                bsStyle="success"
                onClick={this.submit}>Submit</Button>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

class PlaneSelection extends Component {
  render() {
    const tooltip = (
      <Tooltip id="tooltip">At what plane was this scan taken? Select 'Garbage' if poor scan or nothing of interest visible.</Tooltip>
    );

    return (
      <div>
        <h4 className="header">Plane </h4>
        <OverlayTrigger placement="right" overlay={tooltip}>
          <Glyphicon glyph="question-sign" />
        </OverlayTrigger>
        <Buttons
          active={this.props.active}
          buttons={PLANES}
          toggle={true}
          onButtonClick={this.props.onPlaneChange} />
      </div>
    )
  }
}

class RegionSelection extends Component {
  render() {
    const tooltip = (
      <Tooltip id="tooltip">What region of the body is <strong>most</strong> visible?</Tooltip>
    );

    return (
      <div>
        <h4 className="header">Region </h4>
        <OverlayTrigger placement="right" overlay={tooltip}>
          <Glyphicon glyph="question-sign" />
        </OverlayTrigger>
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
    const tooltip = (
      <Tooltip id="tooltip">Select <strong>all</strong> visible features in the scan.</Tooltip>
    );

    return (
      <div>
        <h4 className="header">Features</h4>
        <OverlayTrigger placement="right" overlay={tooltip}>
          <Glyphicon glyph="question-sign" />
        </OverlayTrigger>
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
              key={b.label}
              onClick={e => {this.onButtonClick(e, b)}}>
              {b.label}
            </Button>
          })
        }
      </div>
    );
  }
}

Buttons.propTypes = {
  active: React.PropTypes.arrayOf(React.PropTypes.object), // what is currently active?
  buttons: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  toggle: React.PropTypes.bool,
  vertical: React.PropTypes.bool, // TODO: Implement with CSS
  onButtonClick: React.PropTypes.func,
}

export default App;
