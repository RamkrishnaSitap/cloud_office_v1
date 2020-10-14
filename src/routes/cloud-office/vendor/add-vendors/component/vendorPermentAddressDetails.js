import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Label, Input } from 'reactstrap';
import axiosInstance from '../../../../../util/axiosInstance';
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class VendorPermanentAddressDetails extends Component
{
  constructor()
  {
    super()

    window.vendor_permanent_address_details = this;
  }

  state = {

   allStateList: [],
   allCitiesList: [],

   newVendorDetailsData: {

    vendorId:'',

	    address:'',
	    landlineNo:'',
       state:'',
       city:'',
	    pincode:'',
	    country:'',
	    //region:'',
	    //subregion:'',
	    //globalregion:''
    },

    isFormValid: false,

    formValidation: {
       address: {errorMsg:'Invalid address', validClass: ''},
       landlineNo: {errorMsg:'Invalid mobile no.', validClass: ''},
       state: {errorMsg:'', validClass: ''},
       city: {errorMsg:'Invalid mobile no.', validClass: ''},
       pincode: {errorMsg:'', validClass: ''},
       country: {errorMsg:'Invlid pincode', validClass: ''},
    },
  }

  componentWillMount()
  {
      this.getAllVendorDetails();
      this.getAllStateList();
      this.getAllCitiesList();
  }

  addNewVendorDetails()
  {
      axiosInstance.post('/vendor/add/', this.state.newVendorDetailsData).then((response) => {
        //console.log(response.data);
        NotificationManager.success('Address Details Added Successfully!', '');
     });
  }
  
  getAllVendorDetails()
  {
      axiosInstance.get('/vendor/getById/'+sessionStorage.getItem('vendorId')).then((response) => {
  
          this.setState({
           newVendorDetailsData: response.data
          
          })
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
      let {newVendorDetailsData} = this.state;
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
               newVendorDetailsData.address = e.target.value;
           break;
         case 'landlineNo':
               if(e.target.value==='') formValidation.landlineNo.validClass = '';
               else formValidation.landlineNo.validClass = (e.target.value.length < 5 || !regexp_mob.test(e.target.value))? "is-invalid" : "is-valid";
               newVendorDetailsData.landlineNo = e.target.value;
           break;
         case 'country':
               formValidation.country.validClass = (e.target.value==='')? '' : 'is-valid';
               newVendorDetailsData.country = e.target.value;
           break;  
         case 'state':
               formValidation.state.validClass = (e.target.value==='')? '' : 'is-valid';
               newVendorDetailsData.state = e.target.value;
               this.getCitiesListByState(e.target.value);
           break;  
         case 'city':
               formValidation.city.validClass = (e.target.value==='')? '' : 'is-valid';
               newVendorDetailsData.city = e.target.value;
           break;
         case 'pincode':
               if(e.target.value==='') formValidation.pincode.validClass = '';
               else formValidation.pincode.validClass = (!regexp_pincode.test(e.target.value))? "is-invalid" : "is-valid";
               newVendorDetailsData.pincode = e.target.value;
           break;  
         
         default:
          
       }
   
       isFormValid = (newVendorDetailsData.address.length >= 3  || regexp_address.test(newVendorDetailsData.address) && 
       newVendorDetailsData.landlineNo === '' || regexp_mob.test(newVendorDetailsData.landlineNo) 
       && newVendorDetailsData.pincode === '' || regexp_mob.test(newVendorDetailsData.pincode) )? true : false;
   
       this.setState({formValidation, newVendorDetailsData, isFormValid});
   
       sessionStorage.setItem('isFormValid', isFormValid);
   }
      
   showValidateMsg = () => {
      //alert('showValidateMsg')
      const regexp_address = /^[#.0-9a-zA-Z\s,-]+$/;
      const regexp_mob = /^([+]\d{2})?\d{10}$/;
      const regexp_pincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;

      let {formValidation} = this.state;
      let {newVendorDetailsData} = this.state;
      let {isFormValid} = this.state;
   
      formValidation.address.validClass = (newVendorDetailsData.address.length < 3 || !regexp_address.test(newVendorDetailsData.address))? "is-invalid" : "is-valid";

      if (newVendorDetailsData.landlineNo === '') formValidation.mobileNumber.validClass = '';
      else formValidation.landlineNo.validClass = (!regexp_mob.test(newVendorDetailsData.landlineNo))? "is-invalid" : "is-valid";
     
      if (newVendorDetailsData.pincode === '') formValidation.pincode.validClass = '';
      else formValidation.pincode.validClass = (!regexp_pincode.test(newVendorDetailsData.pincode))? "is-invalid" : "is-valid";

      formValidation.country.validClass = (newVendorDetailsData.country==='')? '' : 'is-valid';
      formValidation.state.validClass = (newVendorDetailsData.state==='')? '' : 'is-valid';
      formValidation.city.validClass = (newVendorDetailsData.city==='')? '' : 'is-valid';

      isFormValid = (newVendorDetailsData.address.length >= 3  || regexp_address.test(newVendorDetailsData.address) && 
      newVendorDetailsData.landlineNo === '' || regexp_mob.test(newVendorDetailsData.landlineNo) 
      && newVendorDetailsData.pincode === '' || regexp_mob.test(newVendorDetailsData.pincode) )? true : false;

       this.setState({formValidation, newVendorDetailsData, isFormValid});
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

        <div className="textfields-wrapper">

        <RctCollapsibleCard heading="Vendor Perment Address Details" customClasses="border border-info">
        <form noValidate autoComplete="off">

   <NotificationContainer />     

           <div className="row">
        
           <div className="col-sm-12 col-md-12 col-xl-12">
        
    <div className="row">
    <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="address">Address</Label>
           <Input className={this.state.formValidation.address.validClass} type="textarea" id="address" name="address" value={this.state.newVendorDetailsData.address} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.address.validClass!=='is-invalid'}>{this.state.formValidation.address.errorMsg}</span>     
        </div>
        </div>
        
        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="landlineNo">Landline No</Label>
           <Input className={this.state.formValidation.landlineNo.validClass} type="number" id="landlineNo" name="landlineNo" value={this.state.newVendorDetailsData.landlineNo} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.landlineNo.validClass!=='is-invalid'}>{this.state.formValidation.landlineNo.errorMsg}</span>     
        </div>
        </div>

        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="country">Country</Label>
           <Input className={this.state.formValidation.country.validClass} type="select" id="country" name="country" value={this.state.newVendorDetailsData.country} 
          onChange={this.handleOnChange} onBlur={this.handleOnChange} >
             <option value=''>-select-</option>
             <option value='India'>India</option>
             </Input>
             <span style={{color:'red'}} hidden={this.state.formValidation.country.validClass!=='is-invalid'}>{this.state.formValidation.country.errorMsg}</span>        
        </div>
        </div>  
        </div>{/*row end*/}
        
        {/*--------------------------------------------------------------------------------*/}

        <div className="row">

        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="state">State</Label>
            <Input className={this.state.formValidation.state.validClass} type="select" id="state" name="state" value={this.state.newVendorDetailsData.state}
            onChange={this.handleOnChange} onBlur={this.handleOnChange} >
                         <option value="select">-select-</option>
                           {stateList}
                         </Input>
       <span style={{color:'red'}} hidden={this.state.formValidation.state.validClass!=='is-invalid'}>{this.state.formValidation.state.errorMsg}</span>     
        </div>
        </div>

        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="city">City</Label>
           <Input className={this.state.formValidation.city.validClass} type="select" id="city" name="city" value={this.state.newVendorDetailsData.city}
            onChange={this.handleOnChange} onBlur={this.handleOnChange} >
                         <option value="select">-select-</option>
                           {citiesList}
                     </Input>
            <span style={{color:'red'}} hidden={this.state.formValidation.city.validClass!=='is-invalid'}>{this.state.formValidation.city.errorMsg}</span>     
        </div>
        </div>

        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="pincode">Pincode</Label>
           <Input className={this.state.formValidation.pincode.validClass} type="number" id="pincode" name="pincode" value={this.state.newVendorDetailsData.pincode} 
           onChange={this.handleOnChange} onBlur={this.handleOnChange} />
           <span style={{color:'red'}} hidden={this.state.formValidation.pincode.validClass!=='is-invalid'}>{this.state.formValidation.pincode.errorMsg}</span>     
        </div>
        </div>

        </div>{/*row end*/}

         {/*--------------------------------------------------------------------------------*/}

{/*
         <div className="row">

         <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="region">Region</Label>
           <Input type="text" id="region" name="region" value={this.state.newVendorDetailsData.region} 
           onChange={(e) => 
           {
              let {newVendorDetailsData} = this.state;
              newVendorDetailsData.region = e.target.value;
        
              this.setState({newVendorDetailsData});
           }} />
        </div>
        </div>

         <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="subregion">Sub-Region</Label>
           <Input type="text" id="subregion" name="subregion" value={this.state.newVendorDetailsData.subregion} 
           onChange={(e) => 
           {
              let {newVendorDetailsData} = this.state;
              newVendorDetailsData.subregion = e.target.value;
        
              this.setState({newVendorDetailsData});
           }} />
        </div>
        </div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="globalregion">Global Region</Label>
   <Input type="text" id="globalregion" name="globalregion" value={this.state.newVendorDetailsData.globalregion} 
   onChange={(e) => 
   {
      let {newVendorDetailsData} = this.state;
      newVendorDetailsData.globalregion = e.target.value;

      this.setState({newVendorDetailsData});
   }} />
</div>
</div>

</div>
*/}

      
           </div>
           </div>
        
           </form>
        </RctCollapsibleCard>
        
         </div>

      );
   };
}