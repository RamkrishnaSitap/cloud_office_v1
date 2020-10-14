import React, { useState, Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Label, Input } from 'reactstrap';

import classnames from 'classnames';

class Example extends Component {

    constructor(){
        super();
    }

  state = {
    activeTab: '2',
  };

  toggle = (tab) => {
     
      this.setState({activeTab: tab});
  }

  render(){
     
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
            onClick={() => this.toggle('1') }
          >
            Tab1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '2' })}
            onClick={() =>  this.toggle('2')}
          >
            More Tabs
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              
            <Label for="Rate"> <span></span> </Label>
<Input type="select" name="select" id="Select"  >
                         <option>-select-</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                         </Input>

            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="6">
            <h4>Tab 2 Contents</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
}

}

export default Example;