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
          <Col xs={12}>
            <strong>Instructions:</strong>
            <p>Select the correct area of the body for the shown scan. The larger the box, the larger the uncertainty.
              <br />Click submit or press enter or space to send your selection.</p>
            <img src={sample} className="mainImage center-block"/>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            Buttons :-)
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
