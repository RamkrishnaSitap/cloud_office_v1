import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Label, Input } from 'reactstrap';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize } from '@material-ui/core';
import axios from 'axios' ;
import axiosInstance from '../../../../../util/axiosInstance';
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class VendorPersonalDetails extends Component
{

  constructor()
  {
    super()

    window.vendor_personal_details = this;
  }

  state = {

    newVendorDetailsData: {

       vendorId:'',
       vendorName:'',
       emailId:'',
       mobileNo:'',
       contactPersonName:'',
       website:'',
    },

    isFormValid: false,

      formValidation: {
         vendorName: {errorMsg:'Vendor name is required', validClass: ''},
         emailId: {errorMsg:'Email address is required', validClass: ''},
         mobileNo: {errorMsg:'Mobile no. is required', validClass: ''},
         contactPersonName: {errorMsg:'Contact person name is required', validClass: ''},
         website: {errorMsg:'', validClass: ''},
      },
  }

  componentWillMount()
  {
   sessionStorage.setItem('isFormValid', false);

      this.getAllVendorDetails();
  }

  addNewVendorDetails()
  {
   if(sessionStorage.getItem('isFormValid')==='true'){
      axiosInstance.post('/vendor/add/', this.state.newVendorDetailsData).then((response) => {

      sessionStorage.setItem('vendorId', this.state.newVendorDetailsData.vendorId);
      //console.log(response.data);
      NotificationManager.success('Personal Details Added Successfully!', '');
     });
   }

  }
  
  getAllVendorDetails()
  {
      axiosInstance.get('/vendor/getById/'+sessionStorage.getItem('vendorId')).then((response) => {
  
          this.setState({
           newVendorDetailsData: response.data
          });

          this.showValidateMsg();
      });
  }

  handleOnChange = (e) =>{
   //alert('handleOnChange')
      let {formValidation} = this.state;
      let {newVendorDetailsData} = this.state;
      let {isFormValid} = this.state;
  
      let caseName = (e.target.id)? e.target.id : e.target.name;
      const regexp_name = /^(?=.{3,30}$)(?![_.])(?!.*[_ .]{2})+[a-zA-Z _]+(?<![_ ])$/;
      const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const regexp_mob = /^([+]\d{2})?\d{10}$/;
      console.log(caseName + ': '+e.target.value)
      switch(caseName) {
   
         case 'vendorName':
               formValidation.vendorName.validClass = (!regexp_name.test(e.target.value))? "is-invalid" : "is-valid";
               if(e.target.value==='') formValidation.vendorName.errorMsg = 'Vendor name is required';
               else if(!regexp_name.test(e.target.value)) formValidation.vendorName.errorMsg = 'Invalid name';
               newVendorDetailsData.vendorName = e.target.value;
           break;
         case 'emailId':
               formValidation.emailId.validClass = (!regexp_email.test(e.target.value))? "is-invalid" : "is-valid";
               if(e.target.value==='') formValidation.emailId.errorMsg = 'Email address is required';
               else if(!regexp_name.test(e.target.value)) formValidation.emailId.errorMsg = 'Invalid email';
               newVendorDetailsData.emailId = e.target.value;
           break;
         case 'mobileNo':
               formValidation.mobileNo.validClass = (!regexp_mob.test(e.target.value))? "is-invalid" : "is-valid";
               if(e.target.value==='') formValidation.mobileNo.errorMsg = 'Mobile no. is required';
               else if(!regexp_name.test(e.target.value)) formValidation.mobileNo.errorMsg = 'Invalid mobile no.';
               newVendorDetailsData.mobileNo = e.target.value;
           break;
         case 'contactPersonName':
               formValidation.contactPersonName.validClass = (!regexp_name.test(e.target.value))? "is-invalid" : "is-valid";
               if(e.target.value==='') formValidation.contactPersonName.errorMsg = 'Contact person name is required';
               else if(!regexp_name.test(e.target.value)) formValidation.contactPersonName.errorMsg = 'Invalid name';
               newVendorDetailsData.contactPersonName = e.target.value;
           break;
         case 'website':
               if (e.target.value === '') formValidation.website.validClass = '';
               else formValidation.website.validClass = (e.target.value.length < 5)? "is-invalid" : "is-valid";
               newVendorDetailsData.website = e.target.value;
           break;  
         
         default:
          
       }
   
       isFormValid = (regexp_name.test(newVendorDetailsData.vendorName) && regexp_email.test(newVendorDetailsData.emailId) && 
       regexp_mob.test(newVendorDetailsData.mobileNo) && regexp_name.test(newVendorDetailsData.contactPersonName) )? true : false;
   
       this.setState({formValidation, newVendorDetailsData, isFormValid});
   
       sessionStorage.setItem('isFormValid', isFormValid);
   }
      
   showValidateMsg = () => {
      //alert('showValidateMsg')
      const regexp_name = /^(?=.{3,30}$)(?![_.])(?!.*[_ .]{2})+[a-zA-Z _]+(?<![_ ])$/;
      const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const regexp_mob = /^([+]\d{2})?\d{10}$/;
     
      let {formValidation} = this.state;
      let {newVendorDetailsData} = this.state;
      let {isFormValid} = this.state;
   
      formValidation.vendorName.validClass = (!regexp_name.test(newVendorDetailsData.vendorName))? "is-invalid" : "is-valid";
      formValidation.emailId.validClass = (!regexp_email.test(newVendorDetailsData.emailId))? "is-invalid" : "is-valid";
      formValidation.mobileNo.validClass = (!regexp_mob.test(newVendorDetailsData.mobileNo))? "is-invalid" : "is-valid";
      formValidation.contactPersonName.validClass = (!regexp_name.test(newVendorDetailsData.contactPersonName))? "is-invalid" : "is-valid";
      
      if(newVendorDetailsData.website==='') formValidation.website.validClass='';
      else formValidation.website.validClass = (newVendorDetailsData.website < 5)? "is-invalid" : "is-valid";

      isFormValid = (regexp_name.test(newVendorDetailsData.vendorName) && regexp_email.test(newVendorDetailsData.emailId) && 
      regexp_mob.test(newVendorDetailsData.mobileNo) && regexp_name.test(newVendorDetailsData.contactPersonName) )? true : false;
   
      this.setState({formValidation, newVendorDetailsData, isFormValid});
      sessionStorage.setItem('isFormValid', isFormValid);
     // alert('isFormValid : '+isFormValid)
   }

   render(){

      return(

        <div className="textfields-wrapper">

        <RctCollapsibleCard heading="Vendor Personal Details" customClasses="border border-info">
        <form noValidate autoComplete="off">

   <NotificationContainer />      

           <div className="row">
        
           <div className="col-sm-12 col-md-12 col-xl-12">
        
    <div className="row">
    <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="vendorName">Vendor Name</Label> <span style={{color:"red"}}>*</span>
           <Input className={this.state.formValidation.vendorName.validClass} id="vendorName" name="vendorName" value={this.state.newVendorDetailsData.vendorName} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
      <span style={{color:'red'}} hidden={this.state.formValidation.vendorName.validClass!=='is-invalid'}>{this.state.formValidation.vendorName.errorMsg}</span>     
        </div>
        </div>
        
        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="emailId">Email Id</Label> <span style={{color:"red"}}>*</span>
           <Input className={this.state.formValidation.emailId.validClass} id="emailId" name="emailId" value={this.state.newVendorDetailsData.emailId} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.emailId.validClass!=='is-invalid'}>{this.state.formValidation.emailId.errorMsg}</span>
        </div>
        </div>
        
        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="mobileNo">Mobile No.</Label> <span style={{color:"red"}}>*</span>
           <Input className={this.state.formValidation.mobileNo.validClass} type="number" id="mobileNo" name="mobileNo" value={this.state.newVendorDetailsData.mobileNo} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.mobileNo.validClass!=='is-invalid'}>{this.state.formValidation.mobileNo.errorMsg}</span>
        </div>
        </div>
        
        </div>{/*row end*/}
        
        {/*--------------------------------------------------------------------------------*/}

        <div className="row">

        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="contactPersonName">Contact Person Name</Label> <span style={{color:"red"}}>*</span>
           <Input className={this.state.formValidation.contactPersonName.validClass} type="text" id="contactPersonName" name="contactPersonName" value={this.state.newVendorDetailsData.contactPersonName} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.contactPersonName.validClass!=='is-invalid'}>{this.state.formValidation.contactPersonName.errorMsg}</span>
        </div>
        </div>

        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="website">Website</Label>
           <Input className={this.state.formValidation.website.validClass} type="text" id="website" name="website" value={this.state.newVendorDetailsData.website} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.website.validClass!=='is-invalid'}>{this.state.formValidation.website.errorMsg}</span>
        </div>
        </div>

        </div>{/*row end*/}
      
  
           </div>
           </div>
        
           </form>
        </RctCollapsibleCard>
        
         </div>

      );
   };
}