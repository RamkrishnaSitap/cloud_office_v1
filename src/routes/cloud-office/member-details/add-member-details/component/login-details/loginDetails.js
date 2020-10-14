import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Label, Input } from 'reactstrap';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize } from '@material-ui/core';
import axios from 'axios' ;
import axiosInstance from '../../../../../../util/axiosInstance';
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class LoginDetails extends Component
{

  constructor()
  {
    super()

    window.login_details = this;
  }

  state = {

    isUserLoginIdExist: false,
    isFormValid: false,

    newMemberDetailsData: {

      memberDetailsId:'',

      userLoginId:'',
      userPassword:'',
      confirmPassword:'',
    },

      formValidation: {
        userLoginId: {errorMsg:'Invalid address', validClass: ''},
        userPassword: {errorMsg:'Invalid address', validClass: ''},
        confirmPassword: {errorMsg:'Invalid address', validClass: ''},
      }
  }

  componentWillMount()
  {
      this.getAllMemberDetails();
  }

  addNewMemberDetails()
  {
    if(sessionStorage.getItem('isFormValid')==='true'){
      axiosInstance.post('/member-details/add/', this.state.newMemberDetailsData).then((response) => {
        //console.log(response.data);
        NotificationManager.success('Login Details Saved Successfully!', '');
     });
  }

  }
  
  getAllMemberDetails()
  {
      axiosInstance.get('/member-details/getById/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
  
          this.setState({
           newMemberDetailsData: response.data
          
          });
          
          let {newMemberDetailsData} = this.state;
          newMemberDetailsData.confirmPassword = newMemberDetailsData.userPassword;
          this.setState(newMemberDetailsData);
          
          this.showValidateMsg();
      });
  }

  findEmailIdAlreadyExist = (emailId, userId) =>{

    this.setState({isUserLoginIdExist: false});
       axiosInstance.get('/member-details/getByEmailId/'+emailId+'/'+userId).then(response => {
    
          if(response.data.userLoginId){
             //alert("This '"+emailId+"' already exist!")
             this.setState({isUserLoginIdExist: true});
          }
       });
    }

  handleOnChange = (e) =>{
    //alert('handleOnChange')
       let {formValidation} = this.state;
       let {newMemberDetailsData} = this.state;
       let {isFormValid} = this.state;
    
       let caseName = (e.target.id)? e.target.id : e.target.name;
       const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       const regexp_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    console.log('#caseName : '+caseName)
       switch(caseName) {
    
          case 'userLoginId':
                formValidation.userLoginId.validClass = (!regexp_email.test(e.target.value))? "is-invalid" : "is-valid";
                if(e.target.value==='') formValidation.userLoginId.errorMsg = 'User login id is required';
                else if(!regexp_email.test(e.target.value)) formValidation.userLoginId.errorMsg = 'Invalid name';
                newMemberDetailsData.userLoginId = e.target.value;

                this.findEmailIdAlreadyExist(e.target.value, newMemberDetailsData.memberDetailsId);

            break;
          case 'userPassword':
                formValidation.userPassword.validClass = (e.target.value.length < 8)? "is-invalid" : "is-valid";
                if(e.target.value==='') formValidation.userPassword.errorMsg = 'Password is required';
                else formValidation.userPassword.errorMsg =  (e.target.value.length < 8)? 'Password must be 8 characters': ''
                newMemberDetailsData.userPassword = e.target.value;
            break; 
          case 'confirmPassword':
                formValidation.confirmPassword.validClass = (newMemberDetailsData.userPassword !== e.target.value)? "is-invalid" : "is-valid";
                formValidation.confirmPassword.errorMsg = (newMemberDetailsData.userPassword !== e.target.value)? "Password not match" : "Please enter confirm password";
                newMemberDetailsData.confirmPassword = e.target.value;
            break;  
          
          default:   
        }

        if(this.state.isUserLoginIdExist){
          formValidation.userLoginId.errorMsg = 'User Login ID already exist!';
          formValidation.userLoginId.validClass = 'is-invalid';
       }
    
        isFormValid = (regexp_email.test(newMemberDetailsData.userLoginId) && !this.state.isUserLoginIdExist
        && newMemberDetailsData.userPassword.length > 7 && newMemberDetailsData.confirmPassword.length > 7
        && newMemberDetailsData.userPassword===newMemberDetailsData.confirmPassword)? true : false;
    
        this.setState({formValidation, newMemberDetailsData, isFormValid});
    
        sessionStorage.setItem('isFormValid', isFormValid);
    }
       
    showValidateMsg = () => {
       //alert('showValidateMsg')
       const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       const regexp_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
 
       let {formValidation} = this.state;
       let {newMemberDetailsData} = this.state;
       let {isFormValid} = this.state;
    
       if(newMemberDetailsData.userLoginId==='') formValidation.userLoginId.validClass = '';
       else formValidation.userLoginId.validClass = (!regexp_email.test(newMemberDetailsData.userLoginId))? "is-invalid" : "is-valid";

       if(newMemberDetailsData.userPassword==='') formValidation.userPassword.validClass = '';
       else formValidation.userPassword.validClass = (newMemberDetailsData.userPassword.length < 8)? "is-invalid" : "is-valid";

       if(newMemberDetailsData.confirmPassword==='') formValidation.confirmPassword.validClass = '';
       else formValidation.confirmPassword.validClass = (newMemberDetailsData.confirmPassword.length < 8)? "is-invalid" : "is-valid";
      
       if(this.state.isUserLoginIdExist){
        formValidation.userLoginId.errorMsg = 'User Login ID already exist!';
        formValidation.userLoginId.validClass = 'is-invalid';
     }

     isFormValid = (regexp_email.test(newMemberDetailsData.userLoginId) && !this.state.isUserLoginIdExist
     && newMemberDetailsData.userPassword.length > 7 && newMemberDetailsData.confirmPassword.length > 7)? true : false;

        this.setState({formValidation, newMemberDetailsData, isFormValid});

       sessionStorage.setItem('isFormValid', isFormValid);
      // alert('isFormValid : '+isFormValid)
    }

   render(){

      return(

    <div className="formelements-wrapper">
      <RctCollapsibleCard heading="Login Details" customClasses="border border-info">
           <form noValidate autoComplete="off">

<NotificationContainer />

<div className="row">

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
  <Label for="userLoginId">User Login ID</Label> <span style={{color:"red"}}>*</span>
  <Input className={this.state.formValidation.userLoginId.validClass} type="text" id="userLoginId" name="userLoginId" value={this.state.newMemberDetailsData.userLoginId}
   onChange={this.handleOnChange} onBlur={this.handleOnChange}/>
   <span style={{color:'red'}} hidden={this.state.formValidation.userLoginId.validClass!=='is-invalid'}>{this.state.formValidation.userLoginId.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
  <Label for="userPassword">Password</Label> <span style={{color:"red"}}>*</span>
  <Input className={this.state.formValidation.userPassword.validClass} type="password" id="userPassword" name="userPassword" value={this.state.newMemberDetailsData.userPassword}
  onChange={this.handleOnChange} onBlur={this.handleOnChange} />
  <span style={{color:'red'}} hidden={this.state.formValidation.userPassword.validClass!=='is-invalid'}>{this.state.formValidation.userPassword.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
  <Label for="confirmPassword">Retype Password</Label> <span style={{color:"red"}}>*</span>
  <Input className={this.state.formValidation.confirmPassword.validClass} type="password" id="confirmPassword" name="confirmPassword" value={this.state.newMemberDetailsData.confirmPassword}
   onChange={this.handleOnChange} onBlur={this.handleOnChange} />
   <span style={{color:'red'}} hidden={this.state.formValidation.confirmPassword.validClass!=='is-invalid'}>{this.state.formValidation.confirmPassword.errorMsg}</span>
</div>
</div>

</div>
</form>
</RctCollapsibleCard>
</div>

      );
   };
}