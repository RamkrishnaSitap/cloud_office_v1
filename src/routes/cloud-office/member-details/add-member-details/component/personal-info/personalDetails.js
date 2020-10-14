import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import {CustomInput, Label, Input } from 'reactstrap';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize, TextField } from '@material-ui/core';
import axios from 'axios';
import axiosInstance from '../../../../../../util/axiosInstance';
import { MDBInput } from 'mdbreact';

export default class PersonalDetails extends Component
{
  constructor()
  {
      super();

    //  this.functionToPass = this.functionToPass.bind(this);
    window.personal_details = this;
  }

   state = {
   
      userRoles: [],
      departmentList: [],
      memberStatusChecked: true,

      memberProfilePhoto: '',

      userPhotoUploading: false,

      isEmailExist: false,
      isFormValid: false,
	
      newMemberDetailsData: {
         memberDetailsId:'',
         alternateEmailId:'',
         
        //reportTo:'',
	     memberStatus:'',
	     gender:'',
	     //maritalStatus:'',
	     salutation:'',
	     memberName:'',
	     dateOfBirth:'',
	     //bloodGroup:'',
	     email:'',
	     userRole:'',
	     //leaveApproverName:'',
	     //costPerHour:'',
        workInDepartment:'',
        
        userLoginId: '',
      },

      formValidation: {
         salutation: {errorMsg:'Salutation is required', validClass: ''},
         memberName: {errorMsg:'User name is required', validClass: ''},
         memberStatus: {errorMsg:'User status is required', validClass: ''},
         email: {errorMsg:'Email address is required', validClass: ''},
         userRole: {errorMsg:'User Role is required', validClass: ''},
         workInDepartment: {errorMsg:'Department is required', validClass: ''},

         alternateEmail: {errorMsg:'Invalid mail', validClass: ''},
         dateOfBirth: {errorMsg:'', validClass: ''},
      },

    };

    componentWillMount()
{
   sessionStorage.setItem('isFormValid', false);

    this.getAllMemberDetails();
    this.getAllUserRoles();
    this.getProfilePhoto();
    this.getAllDepartmentList();
}
  
    handleChange = name => (event, checked) => {
		this.setState({ [name]: checked });
   };

   handleChangeRadio = (e, key) => {
		this.setState({ [key]: e.target.value });
   }
   
   addNewMemberDetails(){

   if(sessionStorage.getItem('isFormValid')==='true'){
      axiosInstance.post('/member-details/add/', this.state.newMemberDetailsData).then((response) => {
         console.log(response.data);
         sessionStorage.setItem('USER_EDIT_ID', response.data.memberDetailsId)
      });
   }

}

getAllMemberDetails(){
    axiosInstance.get('/member-details/getById/'+sessionStorage.getItem('USER_EDIT_ID')).then(response => {

 if(response.data!==''){
        this.setState({
         newMemberDetailsData: response.data
        });
   }
        /*this.setState({
         memberStatusChecked: (this.state.newMemberDetailsData.memberStatus==='Active')? true : false
        });
      */

          //this.showValidateMsg();
    });
}

getAllUserRoles(){
   let userRoles = this.state.userRoles;
    axiosInstance.get('/user-role/getAll').then((response) => {

      response.data.map((val, index) => {
         userRoles.push(val.userRole);
        });
       this.setState({userRoles});
    });
}

getAllDepartmentList(){

   let departmentList = this.state.departmentList;
   axiosInstance.get('/department/getAll').then(response => {

      response.data.map(val => {

         departmentList.push(val.deptName);
      });

      this.setState(departmentList);
   });
}

onFileChangeHandler = (e) => {
   e.preventDefault();
   
   this.setState({userPhotoUploading: true});

   const formData = new FormData();
   formData.append('file', e.target.files[0]);
   formData.append('memberDetailsId', sessionStorage.getItem('USER_EDIT_ID'));
 
   axiosInstance.post('/member-details/uploadMemberProfilePhoto/', formData).then(response => {
   
      sessionStorage.setItem('USER_EDIT_ID', response.data.memberDetailsId);
      this.setState({newMemberDetailsData: {
             memberDetailsId: response.data.memberDetailsId
      }
   });
      this.getProfilePhoto();

   });
};

getProfilePhoto = () =>{
   //alert(memberDocumentsId)
 axiosInstance({
   url: '/member-details/getProfilePhoto/'+sessionStorage.getItem('USER_EDIT_ID'),
   method: 'GET',
   responseType: 'blob'
 }).then((response) => {

const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));

this.setState({memberProfilePhoto: url});
this.setState({userPhotoUploading: false});
//alert(this.state.memberProfilePhoto)
   
 });
 
}

findEmailIdAlreadyExist = (emailId) =>{

let userId = (this.state.newMemberDetailsData.memberDetailsId)? this.state.newMemberDetailsData.memberDetailsId : "0";

this.setState({isEmailExist: false});
   axiosInstance.get('/member-details/getByEmailId/'+emailId+"/"+userId).then(response => {

      if(response.data.email){
         //alert("This '"+emailId+"' already exist!")
         this.setState({isEmailExist: true});
      }
   });
}

handleOnChange = (e) =>{
//alert('handleOnChange')
   let {formValidation} = this.state;
   let {newMemberDetailsData} = this.state;
   let {isFormValid} = this.state;

   let caseName = (e.target.id)? e.target.id : e.target.name;//([_ -]?
   const regexp_name = /^(?=.{3,30}$)(?![_.])(?!.*[_ .]{2})+[a-zA-Z _]+(?<![_ ])$/;
   const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   switch(caseName) {

      case 'salutation':
            formValidation.salutation.validClass = (e.target.value==='')? "is-invalid" : "is-valid";
            newMemberDetailsData.salutation = e.target.value;
        break;
      case 'memberName':
            formValidation.memberName.validClass = (e.target.value==='' || !regexp_name.test(e.target.value))? "is-invalid" : "is-valid";
            if(e.target.value==='') formValidation.memberName.errorMsg = 'User name is required';
            else if(!regexp_name.test(e.target.value)) formValidation.memberName.errorMsg = 'Invalid name';
            newMemberDetailsData.memberName = e.target.value;
        break;
      case 'email':
            formValidation.email.validClass = (e.target.value==='' || !regexp_email.test(e.target.value))? "is-invalid" : "is-valid";
            if(e.target.value==='') formValidation.email.errorMsg = 'Email address is required';
            else if(!regexp_email.test(e.target.value)) formValidation.email.errorMsg = 'Invalid email';
            newMemberDetailsData.userLoginId = e.target.value;
            newMemberDetailsData.email = e.target.value;

            this.findEmailIdAlreadyExist(e.target.value);
        break;
      case 'userRole':
            formValidation.userRole.validClass = (e.target.value==='')? "is-invalid" : "is-valid";
            newMemberDetailsData.userRole = e.target.value;
        break;
      case 'workInDepartment':
            formValidation.workInDepartment.validClass = (e.target.value==='')? "is-invalid" : "is-valid";
            newMemberDetailsData.workInDepartment = e.target.value;
        break;
      case 'alternateEmailId':
                        //console.log('REGEXP : '+regexp_email.test(e.target.value))
            if(e.target.value==='') formValidation.alternateEmail.validClass = '';
            else formValidation.alternateEmail.validClass = (!regexp_email.test(e.target.value))? "is-invalid" : "is-valid";
            newMemberDetailsData.alternateEmailId = e.target.value;
        break;
      case 'dateOfBirth':
                        //console.log('REGEXP : '+regexp_email.test(e.target.value))
            formValidation.dateOfBirth.validClass = (e.target.value==='')? '' : "is-valid";
            newMemberDetailsData.dateOfBirth = e.target.value;
        break;  

      default: 
    }

    if(this.state.isEmailExist){
      formValidation.email.errorMsg = 'Email address already exist!';
      formValidation.email.validClass = 'is-invalid';
   }

    isFormValid = (newMemberDetailsData.salutation.length > 0 && regexp_name.test(newMemberDetailsData.memberName)
      && regexp_email.test(newMemberDetailsData.email) && !this.state.isEmailExist && newMemberDetailsData.userRole.length > 0 
      && newMemberDetailsData.workInDepartment.length > 0 
      && newMemberDetailsData.alternateEmailId.length === 0 || regexp_email.test(newMemberDetailsData.alternateEmailId))? true : false;

    this.setState({formValidation, newMemberDetailsData, isFormValid});

    sessionStorage.setItem('isFormValid', isFormValid);
}
   
showValidateMsg = () => {
   //alert('showValidateMsg')
   const regexp_name = /^(?=.{3,30}$)(?![_.])(?!.*[_ .]{2})+[a-zA-Z _]+(?<![_ ])$/;
   const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   let {formValidation} = this.state;
   let {newMemberDetailsData} = this.state;
   let {isFormValid} = this.state;

   formValidation.salutation.validClass = (newMemberDetailsData.salutation)? "is-valid" : "is-invalid";
   formValidation.memberName.validClass = (newMemberDetailsData.memberName || regexp_name.test(newMemberDetailsData.memberName))? "is-valid" : "is-invalid";
   formValidation.email.validClass = (newMemberDetailsData.email || regexp_email.test(newMemberDetailsData.email))? "is-valid" : "is-invalid";
   formValidation.userRole.validClass = (newMemberDetailsData.userRole)? "is-valid" : "is-invalid";
   formValidation.workInDepartment.validClass = (newMemberDetailsData.workInDepartment)? "is-valid" : "is-invalid";

   if (newMemberDetailsData.alternateEmailId==='') formValidation.alternateEmail.validClass = '';
   else formValidation.alternateEmail.validClass = (regexp_email.test(newMemberDetailsData.alternateEmailId))? "is-valid" : "is-invalid";
   
   formValidation.dateOfBirth.validClass = (newMemberDetailsData.dateOfBirth==='')? '' : "is-valid";

   if(this.state.isEmailExist){
      formValidation.email.errorMsg = 'Email address already exist!';
      formValidation.email.validClass = 'is-invalid';
   }

   isFormValid = (newMemberDetailsData.salutation.length > 0 && regexp_name.test(newMemberDetailsData.memberName)
      && regexp_email.test(newMemberDetailsData.email) && !this.state.isEmailExist && newMemberDetailsData.userRole.length > 0 
      && newMemberDetailsData.workInDepartment.length > 0 
      && newMemberDetailsData.alternateEmailId.length === 0 || regexp_email.test(newMemberDetailsData.alternateEmailId))? true : false;
   
   this.setState({formValidation, isFormValid});
   sessionStorage.setItem('isFormValid', isFormValid);
  // alert('isFormValid : '+isFormValid)
}

   render(){

      const userRoles = this.state.userRoles.map((val) =>{
         return(
            <option value={val}> {val} </option>
          )
      });

      const departmentList = this.state.departmentList.map((val) =>{
         return(
            <option value={val}> {val} </option>
          )
      });
     
      return(
<div className="textfields-wrapper">

<RctCollapsibleCard heading="Personal Details" customClasses="border border-info">
<form noValidate autoComplete="off">
   
   <div className="row">

   <div className="col-sm-12 col-md-12 col-xl-12">

   <div className="row">
   <div className="col-sm-3 col-md-3 col-xl-3">
   
   <div className="form-group">
       <img height="200px" width="200px" src={(this.state.memberProfilePhoto)?this.state.memberProfilePhoto:require('Assets/avatars/profile.png')}></img>  

       <br></br>
<CustomInput type="file" id="docOriginalName" onChange={this.onFileChangeHandler} hidden={this.state.userPhotoUploading} /> 

<div className="row" hidden={!this.state.userPhotoUploading}>
<div className="spinner-grow text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow text-danger" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <span className="text-primary" style={{textAlign: 'center', verticalAlign: 'middle'}}>Loading...</span>   
</div>

   </div>
   </div>

   <div className="col-sm-9 col-md-9 col-xl-9">
<div className="row">

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="salutation">Salutation</Label> <span style={{color:"red"}}>*</span>
   <FormControl component="fieldset" required>
                      <RadioGroup className={this.state.formValidation.salutation.validClass} row aria-label="salutation" id="salutation" name="salutation" value={this.state.newMemberDetailsData.salutation} 
                       onChange={this.handleOnChange}>
                        <FormControlLabel value="Mr" control={<Radio color="primary" />} label="Mr" />
                        <FormControlLabel value="Mrs" control={<Radio color="primary" />} label="Mrs" />
                        <FormControlLabel value="Miss" control={<Radio color="primary" />} label="Miss" />
                      </RadioGroup>
  </FormControl> 
  <span style={{color:'red'}} hidden={this.state.formValidation.salutation.validClass!=='is-invalid'}>{this.state.formValidation.salutation.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
  <Label for="memberName">User Name</Label> <span style={{color:"red"}}>*</span>
   <Input className={this.state.formValidation.memberName.validClass} id="memberName" fullWidth label="memberName" value={this.state.newMemberDetailsData.memberName} 
   onChange={this.handleOnChange} onBlur={this.handleOnChange}/>

 <span style={{color:'red'}} hidden={this.state.formValidation.memberName.validClass!=='is-invalid'}>{this.state.formValidation.memberName.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="email">Email</Label> <span style={{color:"red"}}>*</span>
   <Input className={this.state.formValidation.email.validClass} id="email" fullWidth label="email" value={this.state.newMemberDetailsData.email} 
   onChange={this.handleOnChange} onBlur={this.handleOnChange} />
    <span style={{color:'red'}} hidden={this.state.formValidation.email.validClass!=='is-invalid'}>{this.state.formValidation.email.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="alternateEmailId">Alternate Email</Label>
   <Input className={this.state.formValidation.alternateEmail.validClass} id="alternateEmailId" label="alternateEmailId" 
   value={this.state.newMemberDetailsData.alternateEmailId} 
   onChange={this.handleOnChange} onBlur={this.handleOnChange} />
    <span style={{color:'red'}} hidden={this.state.formValidation.alternateEmail.validClass!=='is-invalid'}>{this.state.formValidation.alternateEmail.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <FormControl component="fieldset" required>
   <Label for="Gender">Gender</Label>
                      <RadioGroup row aria-label="gender" name="gender2" value={this.state.newMemberDetailsData.gender} 
                      onChange={(e) => {

                      let {newMemberDetailsData} = this.state;
                      newMemberDetailsData.gender = e.target.value;

                      this.setState({newMemberDetailsData})

                      }} >
                        <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio color="primary" />} label="Other" />
                      </RadioGroup>
  </FormControl> 
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="dateOfBirth">Date of Birth</Label>
   <Input className={this.state.formValidation.dateOfBirth.validClass} id="dateOfBirth" type="date" fullWidth label="dateOfBirth" value={this.state.newMemberDetailsData.dateOfBirth} 
   onChange={(e) => 
      {
         let {newMemberDetailsData} = this.state;
         let {formValidation} = this.state;
         newMemberDetailsData.dateOfBirth = e.target.value;
         formValidation.dateOfBirth.validClass = 'is-valid';
         
         this.setState({newMemberDetailsData, formValidation});
      }} />
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <FormControl component="fieldset">
   <Label for="MemberStatus">User Status <span style={{color:"red"}}>*</span></Label>

   <FormControlLabel className={this.state.formValidation.memberStatus.validClass} value="memberStatus" control={ <Switch checked={this.state.memberStatusChecked} onChange={(e) =>{
    
    let {memberStatusChecked} = this.state;
    let {newMemberDetailsData} = this.state;

   memberStatusChecked ? newMemberDetailsData.memberStatus='Deactive' : newMemberDetailsData.memberStatus='Active';

   memberStatusChecked = !this.state.memberStatusChecked;

    this.setState({memberStatusChecked, newMemberDetailsData});

     }} aria-label="checkedA">
    
  </Switch>} label={ this.state.memberStatusChecked ? 'Active' : 'Deactive' }  />
   </FormControl>
   <span style={{color:'red'}} hidden={this.state.formValidation.memberStatus.validClass!=='is-invalid'}>{this.state.formValidation.memberStatus.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="userRole">User Role</Label> <span style={{color:"red"}}>*</span>
   <FormGroup>
         <Input className={this.state.formValidation.userRole.validClass} type="select" name="userRole" id="userRole" value={this.state.newMemberDetailsData.userRole}
                   onChange={this.handleOnChange} >
                  <option value=''>-select-</option>
                   {userRoles}
                  </Input>
                </FormGroup>
                <span style={{color:'red'}} hidden={this.state.formValidation.userRole.validClass!=='is-invalid'}>{this.state.formValidation.userRole.errorMsg}</span>                
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="workInDepartment">Work In Department</Label> <span style={{color:"red"}}>*</span>
   <FormGroup>
                  <Input className={this.state.formValidation.workInDepartment.validClass} type="select" name="workInDepartment" id="workInDepartment" value={this.state.newMemberDetailsData.workInDepartment}
                   onChange={this.handleOnChange}>
                  <option value=''>-select-</option>
                   {departmentList}
                  </Input>
                </FormGroup>
                <span style={{color:'red'}} hidden={this.state.formValidation.workInDepartment.validClass!=='is-invalid'}>{this.state.formValidation.workInDepartment.errorMsg}</span>
</div>
</div>

</div>{/*row end*/}

   </div>

   </div>{/* row end*/}

   </div>
   </div>

   </form>
</RctCollapsibleCard>

 </div>
      );
   };
}