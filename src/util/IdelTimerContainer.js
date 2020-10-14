import React, { Component } from 'react'
import IdleTimer from 'react-idle-timer'
import { MDBModal, MDBModalBody, MDBModalFooter, MDBBtn } from 'mdbreact'
import Countdown from 'react-countdown';
import { IoMdWarning } from 'react-icons/io';
 
export default class IdelTimerContainer extends Component {

  constructor(props) {
    super(props)
    this.idleTimer = null
    this.handleOnAction = this.handleOnAction.bind(this)
    this.handleOnActive = this.handleOnActive.bind(this)
    this.handleOnIdle = this.handleOnIdle.bind(this)
    this.handleOnSessionExpired = this.handleOnSessionExpired.bind(this)
  }

  state = {
    modal : false,
    modal2 : false
  }

  renderer = ({minutes, seconds, completed }) => {
    if (completed) {
      
      this.userSignOut();

      return "Time expired";
    } else {
      // Render a countdown
      return <span> {minutes} min : {seconds} secs</span>;
    }
  };

  renderer2 = ({minutes, seconds, completed }) => {
    if (completed) {
      this.setState({modal2: true});
      return "Time expired";
    }else { return "" }
  };

  renderer3 = ({minutes, seconds, completed }) => {
    if (completed) {
      this.userSignOut();
      return "Time expired";
    }else { return <span> {seconds} secs</span> }
  };

  
  render() {

    const idelTimeModal = (sessionStorage.getItem('token_id'))? (

      <IdleTimer 
      ref={ref => { this.idleTimer = ref }}
      timeout={1000 * 60 * 5}
      onActive={this.handleOnActive}
      onIdle={this.handleOnIdle}
      onAction={this.handleOnAction}
      debounce={250} />

    ) : "";

    const idelTimeSessionExpireModal = (sessionStorage.getItem('token_id'))? (

      <Countdown 
      date={Date.now() + 1000 * 60 * 60 * 9}
      renderer={this.renderer2}
      className="p-2"
    />

    ) : "";

    return (
      <div>

       {idelTimeModal}
       {idelTimeSessionExpireModal}
   
        <MDBModal isOpen={this.state.modal} centered>
        <MDBModalBody className="text-center">
<p className="text-monospace" style={{fontSize: '18px'}}> 
<IoMdWarning />
  Your session will expire in {" "} 
  <Countdown 
    date={Date.now() + 1000 * 60 * 2}
    renderer={this.renderer}
    className="p-2"
  />
</p>
        </MDBModalBody>
        <MDBModalFooter className="text-center">
          <MDBBtn color="blue-grey" onClick={this.userSignOut.bind(this)}>Log me out</MDBBtn>
          <MDBBtn color="primary" onClick={this.toggle(0)}>Keep me signed in</MDBBtn>
        </MDBModalFooter>
      </MDBModal>


      {/*--------------------------------------------------------------------------------------*/}

<MDBModal isOpen={this.state.modal2} centered>
  <MDBModalBody className="text-center">
<p className="text-monospace" style={{fontSize: '18px'}}> 
<IoMdWarning />
  Your session has been expired! {" "} 
  </p>
  <p> [ You will redirect to login page after {" "}
  <Countdown 
    date={Date.now() + 1000 * 20}
    renderer={this.renderer3}
    className="p-2"
  /> ]
  </p>
  <p>Please login again for access the application.</p>
        </MDBModalBody>
        <MDBModalFooter className="text-center">
          <MDBBtn color="blue-grey" onClick={this.userSignOut.bind(this)}>OK</MDBBtn>
        </MDBModalFooter>
      </MDBModal>

      </div>
    )
  }

  toggle = nr => () => {

    this.setState({
      modal: !this.state.modal
    });
  }
 
  handleOnAction = (event) =>{
    console.log('user did something', event)
  }
 
  handleOnActive = (event) =>{
    console.log('user is active', event)
    console.log('time remaining', this.idleTimer.getRemainingTime())
  }
 
  handleOnIdle = (event) =>{
    console.log('user is idle', event)

    this.setState({modal: true});
  }

  handleOnSessionExpired = (event) =>{

     this.setState({modal2: true});
  }

  userSignOut = () =>{
//alert('going to signout...')
    this.setState({modal: false, modal2: false});
    sessionStorage.clear();
    this.props.history.push("/signin");
  }
}