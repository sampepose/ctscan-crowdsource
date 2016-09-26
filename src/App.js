import React, { Component } from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import fullbody from './img/fullbody.jpg';
import sample from './img/sample.jpg';
import './App.css';
import Rnd from 'react-rnd';
import ReactCrop from 'react-image-crop';

class App extends Component {
  // TODO: Load image from server
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={9}>
            <strong>Instructions:</strong>
            <p>Select the correct area of the body for the shown scan. The larger the box, the larger the uncertainty.
              <br />Click submit or press enter or space to send your selection.</p>
            <img src={sample} className="mainImage center-block"/>
          </Col>
          <Col xs={3}>
            <BodyPartSelector />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const noCrop = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

class BodyPartSelector extends Component {
  constructor() {
    super();
    this.state = {
      crop: noCrop,
    };
    this.onComplete = this.onComplete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  render() {
    return (
      <div id="windowContainer" onKeyPress={this.onKeyPress}>
        <ReactCrop crop={this.state.crop} onComplete={this.onComplete} src={fullbody} id="fullbody" />
        <Button bsStyle="primary" bsSize="large" className="center-block" onClick={this.onSubmit}>Submit</Button>
      </div>
    );
  }

  onComplete(crop, pixelCrop) {
    this.setState({
      crop,
    });
  }

  onKeyPress(e) {
    console.log(e.key)
    if (e.key === 'Enter' || e.key === ' ') {
      console.log('submit');
      console.log(this.state.crop)
      this.onSubmit();
    }
  }

  onSubmit() {
    const {x, y, width, height} = this.state.crop;
    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
      return;
    }
    // TODO: Send this.state.crop to the server
    console.log(this.state.crop);
    this.setState({
      crop: noCrop,
    });
  }
}

export default App;
