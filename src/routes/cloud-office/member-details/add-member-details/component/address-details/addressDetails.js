import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Label, Input } from 'reactstrap';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize } from '@material-ui/core';
import axios from 'axios' ;
import axiosInstance from '../../../../../../util/axiosInstance';
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class AddressDetails extends Component
{
   constructor(props)
   {
      super(props);

      window.address_details = this;
   }

   state = {

      allStateList: [],
      allCitiesList: [],

     newMemberDetailsData: {

      memberDetailsId:'',

         address:'',
         mobileNumber:'',
         alternateMobileNumber:'',
	      state:'',
	      city:'',
	      pincode:'',
         //empergenceyNumber:''
      },

      isFormValid: false,

      formValidation: {
         address: {errorMsg:'Invalid address', validClass: ''},
         mobileNumber: {errorMsg:'Invalid mobile no.', validClass: ''},
         alternateMobileNumber: {errorMsg:'Invalid mobile no.', validClass: ''},
         state: {errorMsg:'', validClass: ''},
         city: {errorMsg:'', validClass: ''},
         pincode: {errorMsg:'Invlid pincode', validClass: ''},
      },
   } 

   componentWillMount()
   {
       this.getAllMemberDetails();

       this.getAllStateList();
       this.getAllCitiesList();
   }

   handleChange = name => (event, checked) => {
		this.setState({ [name]: checked });
   };

addNewMemberDetails()
{
   if(sessionStorage.getItem('isFormValid')==='true'){
    axiosInstance.post('/member-details/add/', this.state.newMemberDetailsData).then((response) => {
      //console.log(response.data);
      NotificationManager.success('Address Details Saved Successfully!', '');
   });
}

}

getAllMemberDetails()
{
        axiosInstance.get('/member-details/getById/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {

         this.setState({newMemberDetailsData: response.data}, ()=>{console.log('#newMemberDetailsData :'+this.state.newMemberDetailsData.memberDetailsId)});
     //this.showValidateMsg();
            //alert(this.state.newMemberDetailsData.memberDetailsId+', '+this.state.newMemberDetailsData.address);
        });
}

getAllStateList()
{
   let {allStateList} = this.state;

   axiosInstance.get('/state-and-cities/getAllStateList').then((response) => {

  response.data.map(val => {
   allStateList.push(val);
  });
  
  this.setState(allStateList);
 
  });

}    

getAllCitiesList()
{
   let temp_allCitiesList = [];

   axiosInstance.get('/state-and-cities/getAllCitieList').then((response) => {

  response.data.map(val => {
   temp_allCitiesList.push(val);
  });

  this.setState({allCitiesList: temp_allCitiesList});

  });
}

getCitiesListByState(stateName)
{
   let temp_allCitiesList = [];

   axiosInstance.get('/state-and-cities/getCitiesByState/'+stateName).then((response) => {

  response.data.map(val => {
   temp_allCitiesList.push(val);
  });

  this.setState({allCitiesList: temp_allCitiesList});

  });
}    

handleOnChange = (e) =>{
   //alert('handleOnChange')
      let {formValidation} = this.state;
      let {newMemberDetailsData} = this.state;
      let {isFormValid} = this.state;

      let caseName = (e.target.id)? e.target.id : e.target.name;
      const regexp_address = /^[#.0-9a-zA-Z\s,-]+$/;
      const regexp_mob = /^([+]\d{2})?\d{10}$/;
      const regexp_pincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
   
      switch(caseName) {
   
         case 'address':
               formValidation.address.validClass = (e.target.value.length < 3 || !regexp_address.test(e.target.value))? "is-invalid" : "is-valid";
               if(e.target.value==='') formValidation.address.errorMsg = 'Address is required';
               else if(!regexp_address.test(e.target.value)) formValidation.address.errorMsg = 'Invalid name';
               newMemberDetailsData.address = e.target.value;
           break;
         case 'mobileNumber':
               if(e.target.value==='') formValidation.mobileNumber.validClass = '';
               else formValidation.mobileNumber.validClass = (e.target.value.length < 5 || !regexp_mob.test(e.target.value))? "is-invalid" : "is-valid";
               newMemberDetailsData.mobileNumber = e.target.value;
           break;
         case 'alternateMobileNumber':
               if(e.target.value==='') formValidation.mobileNumber.validClass = '';
               else formValidation.alternateMobileNumber.validClass = (e.target.value.length < 5 || !regexp_mob.test(e.target.value))? "is-invalid" : "is-valid";
               newMemberDetailsData.alternateMobileNumber = e.target.value;
           break;
         case 'pincode':
               if(e.target.value==='') formValidation.pincode.validClass = '';
               else formValidation.pincode.validClass = (e.target.value.length < 5 || !regexp_pincode.test(e.target.value))? "is-invalid" : "is-valid";
               newMemberDetailsData.pincode = e.target.value;
           break;  
         
         default:
          
       }
   
       isFormValid = (newMemberDetailsData.address.length >= 3  || regexp_address.test(newMemberDetailsData.address) && 
       newMemberDetailsData.mobileNumber===null || regexp_mob.test(newMemberDetailsData.mobileNumber) && 
       newMemberDetailsData.alternateMobileNumber===null || regexp_mob.test(newMemberDetailsData.alternateMobileNumber) &&
       newMemberDetailsData.pincode===null || regexp_mob.test(newMemberDetailsData.pincode) )? true : false;
   
       this.setState({formValidation, newMemberDetailsData, isFormValid});
   
       sessionStorage.setItem('isFormValid', isFormValid);
   }
      
   showValidateMsg = () => {
      //alert('showValidateMsg')
      const regexp_address = /^[#.0-9a-zA-Z\s,-]+$/;
      const regexp_mob = /^([+]\d{2})?\d{10}$/;
      const regexp_pincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;

      let {formValidation} = this.state;
      let {newMemberDetailsData} = this.state;
      let {isFormValid} = this.state;
   
      formValidation.address.validClass = (newMemberDetailsData.address.length > 2 && regexp_address.test(newMemberDetailsData.address))? "is-valid" : "is-invalid";
      isFormValid = (newMemberDetailsData.address.length >= 3  || regexp_address.test(newMemberDetailsData.address))? true : false;

       this.setState({formValidation, newMemberDetailsData, isFormValid});
      sessionStorage.setItem('isFormValid', isFormValid);
     // alert('isFormValid : '+isFormValid)
   }

   render(){
     
const stateList = this.state.allStateList.map((val) => {
   return(
      <option value={val}> {val} </option>
    )
});

const citiesList = this.state.allCitiesList.map((val) => {
   return(
      <option value={val}> {val} </option>
    )
});

      return(

         <div className="formelements-wrapper">
          <RctCollapsibleCard heading="Address Details" customClasses="border border-info">
            <form noValidate autoComplete="off">

            <NotificationContainer />

<div className="row">
<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
<Label for="address">Address</Label> <span style={{color:"red"}}>*</span>
<Input className={this.state.formValidation.address.validClass} type="textarea" id="address" name="address" value={this.state.newMemberDetailsData.address}
 onChange={this.handleOnChange} onBlur={this.handleOnChange} />
 <span style={{color:'red'}} hidden={this.state.formValidation.address.validClass!=='is-invalid'}>{this.state.formValidation.address.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="mobileNumber">Mobile No.</Label>
   <Input className={this.state.formValidation.mobileNumber.validClass} type="text" id="mobileNumber"  name="mobileNumber" value={this.state.newMemberDetailsData.mobileNumber}
    onChange={this.handleOnChange} onBlur={this.handleOnChange} />
    <span style={{color:'red'}} hidden={this.state.formValidation.mobileNumber.validClass!=='is-invalid'}>{this.state.formValidation.mobileNumber.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="alternateMobileNumber">Alternate Mobile No.</Label>
   <Input  className={this.state.formValidation.alternateMobileNumber.validClass} type="text" id="alternateMobileNumber" name="alternateMobileNumber" value={this.state.newMemberDetailsData.alternateMobileNumber}
    onChange={this.handleOnChange} onBlur={this.handleOnChange} />
    <span style={{color:'red'}} hidden={this.state.formValidation.alternateMobileNumber.validClass!=='is-invalid'}>{this.state.formValidation.alternateMobileNumber.errorMsg}</span>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="state">State</Label>
         <Input className={this.state.formValidation.state.validClass} type="select" id="state" name="state" value={this.state.newMemberDetailsData.state}
         onChange={(e) => {

let {newMemberDetailsData} = this.state;
let {formValidation} = this.state;
newMemberDetailsData.state = e.target.value;
formValidation.state.validClass = 'is-valid';

this.setState({newMemberDetailsData, formValidation});

this.getCitiesListByState(e.target.value);

}} >
                         <option value="select">-select-</option>
                           {stateList}
                         </Input>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="city">City</Label>
   <Input className={this.state.formValidation.city.validClass} type="select" id="city" name="city" value={this.state.newMemberDetailsData.city}
                      onChange={(e) => {

let {newMemberDetailsData} = this.state;
let {formValidation} = this.state;
newMemberDetailsData.city = e.target.value;
formValidation.city.validClass = 'is-valid'
this.setState({newMemberDetailsData, formValidation});

}} >
                         <option value="select">-select-</option>
                           {citiesList}
                     </Input>
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="pincode">PIN/ZIP Code</Label>
   <Input className={this.state.formValidation.pincode.validClass} type="text" id="pincode" name="pincode" value={this.state.newMemberDetailsData.pincode}
    onChange={this.handleOnChange} onBlur={this.handleOnChange} />
    <span style={{color:'red'}} hidden={this.state.formValidation.pincode.validClass!=='is-invalid'}>{this.state.formValidation.pincode.errorMsg}</span>
</div>
</div>

{/*
<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="empergenceyNumber">Empergencey Number</Label>
   <Input type="text" id="empergenceyNumber" name="empergenceyNumber" value={this.state.newMemberDetailsData.empergenceyNumber}
   onChange={(e) => {

let {newMemberDetailsData} = this.state;
newMemberDetailsData.empergenceyNumber = e.target.value;

this.setState({newMemberDetailsData});

}} />
</div>
</div>
*/}

</div>{/*row end*/}

         </form>
         </RctCollapsibleCard>
         </div>

      );

   };

}