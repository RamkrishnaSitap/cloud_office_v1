/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput, MDBCard, MDBCardText, MDBCardTitle } from 'mdbreact';

// components
import {
   SessionSlider
} from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

//Auth File
import Auth from '../Auth/Auth';
import { Fab } from '@material-ui/core';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axiosInstance from '../util/axiosInstance';
import SimpleBackdrop from '../components/CustomComponent/Loader/SimpleBackdrop';


const auth = new Auth();

class Signin extends Component {

   state = {
      email: 'demo@example.com',
      password: 'test#123',

      authRequest: {
         username: '',
         password: '',
      },

      modal: false,
      errorMsg: '',
      accessDenied: true,

      isSigninButtonDisable: true,

      formValidation: {
         username: {errorMsg:'Please enter email address', validClass: ''},
         password: {errorMsg:'Please enter password', validClass: ''},
      },

      isOpen: false
   }

   toggle = () => {
      this.setState({
        modal: !this.state.modal
      });
    }
	/**
	 * On User Login
	 */
    onUserLogin = async () => {
      //alert('onUserLogin')
   this.setState({isOpen: true});  
   this.setState({accessDenied: true});

      axiosInstance.post('/authenticate', this.state.authRequest).then(response => {
          //alert(JSON.stringify(response.data));
          
          this.setState({isOpen: false}); 
          if(response.data != null && response.data != 'access denied'){

            sessionStorage.setItem('token_id', JSON.stringify(response.data));
            axiosInstance.defaults.headers.common['Authorization'] = 'Bearer '+JSON.stringify(response.data);
         
//----------------------------------
axiosInstance.get('/member-details/getByEmailId/'+this.state.authRequest.username +'/'+"0").then(response => {

   if(response.data.memberStatus==='Active'){

   //console.log(JSON.stringify(response.data))
    sessionStorage.setItem('MEMBER_ID', response.data.memberDetailsId);
    sessionStorage.setItem('memberName', response.data.memberName);
    sessionStorage.setItem('memberEmailId', response.data.email);

    sessionStorage.setItem('USER_ROLE_ID', response.data.userRoleId.userRoleId);
    sessionStorage.setItem('USER_ROLE_NAME', response.data.userRoleId.userRole);

    this.getPermission(response.data.userRoleId.userRoleId);

    this.props.history.push("/app/dashboard/ecommerce");

   }else{
      sessionStorage.clear();
      this.setState({
         errorMsg: "Your account is not activated yet!, Please contact the Administrator"
      , accessDenied: false});
      this.setState({isOpen: false});
   }

 });
//----------------------------------
          }else{
            this.setState({
               errorMsg: "Please check your username/email address and password and try logging in again. If you've forgotten your password, choose 'Forgot password?'"
            , accessDenied: false});
            sessionStorage.clear();
            this.props.history.push("/signin");
          }
         
      }, ).catch(error => {
         
         this.setState({
            modal: !this.state.modal, errorMsg: error+''
          });
          this.setState({isOpen: false});
         sessionStorage.clear();
         this.props.history.push("/signin");
      })

   }

   getPermission(userRoleId){
      axiosInstance.get('/access-permission/getAllUserPermissionByUserRoleId/'+userRoleId).then((response) => {
         sessionStorage.setItem('USER_ROLE', JSON.stringify(response.data));
      });
   }

	/**
	 * On User Sign Up
	 */
   onUserSignUp() {
      this.props.history.push('/signup');
   }

   handleOnChange = (e) =>{

      this.setState({accessDenied: true});

      let {authRequest} = this.state;
      let {formValidation} = this.state;

      const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let caseName = (e.target.id)? e.target.id : e.target.name;

      switch(caseName) {
   
         case 'username':
               formValidation.username.validClass = (!regexp_email.test(e.target.value))? "is-invalid" : "is-valid";
               if(e.target.value==='') formValidation.username.errorMsg = 'Please enter email address';
               else if(!regexp_email.test(e.target.value)) formValidation.username.errorMsg = 'Invalid email';
               authRequest.username = e.target.value;
           break;
         case 'password':
            console.log('#PASSWORD : '+e.target.value+', '+(e.target.value===''))
               formValidation.password.validClass = (e.target.value==='')? "is-invalid" : "is-valid";
               authRequest.password = e.target.value;
           break;
         
         default:
      }     

      if(regexp_email.test(authRequest.username) && authRequest.password!==''){
         this.setState({isSigninButtonDisable: false});
      }
      
      this.setState({authRequest, formValidation});

   }

   render() {
      const { email, password } = this.state;
      const { loading } = this.props;
      return (
         <QueueAnim type="bottom" duration={2000}>
              <SimpleBackdrop isOpen={this.state.isOpen}/>
            <div className="rct-session-wrapper">
               {loading &&
                  <LinearProgress />
               }
               <AppBar position="static" className="session-header">
                  <Toolbar>
                     <div className="container">
                        <div className="d-flex justify-content-between">
                           <div className="session-logo">
                              <Link to="/">
                                 <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                              </Link>
                           </div>
                           <div>
                              <a className="mr-15" onClick={() => this.onUserSignUp()}>Create New account?</a>
                              <Button variant="contained" className="btn-light" onClick={() => this.onUserSignUp()}>Sign Up</Button>
                           </div>
                        </div>
                     </div>
                  </Toolbar>
               </AppBar>
         
               <div className="session-inner-wrapper">
                  <div className="container">
                     <div className="row row-eq-height">
                     <div className="col-sm-1 col-md-2 col-lg-2"></div>
                        <div className="col-sm-8 col-md-8 col-lg-8">
                           <div className="session-body">

   <MDBCard className="card-body" border="danger" text="red" hidden={this.state.accessDenied}>
    <MDBCardText text="red">
      {this.state.errorMsg}
    </MDBCardText>
  </MDBCard>        
  <br/>
                              <div className="session-head mb-30">
                                 <h2 className="font-weight-bold">Get started with {AppConfig.brandName}</h2>
                                {/* <p className="mb-0">Most powerful ReactJS admin panel</p> */}
                              </div>
   
                              <Form>
                                 <FormGroup className="has-wrapper">
                                 <MDBInput className={this.state.formValidation.username.validClass} name="username" label="Enter your email address" icon="envelope" group type="email" validate outline size="lg"
                                   onChange={this.handleOnChange} onBlur={this.handleOnChange} />
                                    
                                 <MDBInput className={this.state.formValidation.password.validClass} name="password" label="Enter your password" icon="lock" group type="password" validate outline size="lg" 
                                   onChange={this.handleOnChange} onBlur={this.handleOnChange} />
                                 </FormGroup>

                                 <FormGroup className="mb-15">
                                    <Button
                                       color="primary"
                                       className="btn-block text-white w-100"
                                       variant="contained"
                                       size="large"
                                       onClick={() => this.onUserLogin()}
                                       disabled={this.state.isSigninButtonDisable}
                                    >
                                       Sign In
                            			</Button>
                                 </FormGroup>

                                 <FormGroup className="mb-15">
                                    <Button
                                       variant="contained"
                                       className="btn-info btn-block text-white w-100"
                                       size="large"
                                       //onClick={() => this.loginAuth0()}
                                    >
                                       Forgot Password
                            			</Button>
                                 </FormGroup>
                          

                              </Form>
                             
                           {/*  
                              <p className="mb-20">or sign in with</p>
                              <Fab variant="round" size="small"
                                 className="btn-facebook mr-15 mb-20 text-white"
                                 //onClick={() => this.props.signinUserWithFacebook(this.props.history)}
                              >
                                 <i className="zmdi zmdi-facebook"></i>
                              </Fab>
                              <Fab variant="round" size="small"
                                 className="btn-google mr-15 mb-20 text-white"
                                 //onClick={() => this.props.signinUserWithGoogle(this.props.history)}
                              >
                                 <i className="zmdi zmdi-google"></i>
                              </Fab>
                              <Fab variant="round" size="small"
                                 className="btn-twitter mr-15 mb-20 text-white"
                                 //onClick={() => this.props.signinUserWithTwitter(this.props.history)}
                              >
                                 <i className="zmdi zmdi-twitter"></i>
                              </Fab>
                              <Fab variant="round" size="small"
                                 className="btn-instagram mr-15 mb-20 text-white"
                                 //onClick={() => this.props.signinUserWithGithub(this.props.history)}
                              >
                                 <i className="zmdi zmdi-github-alt"></i>
                              </Fab>
                              <p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>
                              <p className="mb-0"><a target="_blank" href="#/terms-condition" className="text-muted">Terms of Service</a></p>
                        */}  
                           
                           </div>
                        </div>
                       {/* 
                        <div className="col-sm-5 col-md-5 col-lg-4">
                           <SessionSlider />
                        </div>
                       */}
           
                     </div>
                  </div>
               </div>

               
            </div>

{/*--------------------------------ERROR MSG MODAL----------------------------------------------*/}
      <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
        <MDBModalHeader toggle={this.toggle}>ERROR</MDBModalHeader>
        <MDBModalBody>
          {this.state.errorMsg}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
{/*------------------------------------------------------------------------------*/}

         </QueueAnim>
      );
   }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
   const { user, loading } = authUser;
   return { user, loading }
}

export default connect(mapStateToProps, {
/*   signinUserInFirebase,
   signinUserWithFacebook,
   signinUserWithGoogle,
   signinUserWithGithub,
   signinUserWithTwitter
   */
})(Signin);
