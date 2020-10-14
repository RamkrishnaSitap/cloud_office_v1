import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Label, Input } from 'reactstrap';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize } from '@material-ui/core';
import axios from 'axios' ;
import axiosInstance from '../../../../../util/axiosInstance';
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class VendorOtherDetails extends Component
{

  constructor(props)
  {
    super(props);

    window.vendor_other_details = this;
  }

  state = {

    newVendorDetailsData: {

        vendorId:'',

          faxNo:'',
          panNo:'',
          //cstNo:'',
          gstNo:'',
    }
  }

  componentWillMount()
  {
      this.getAllVendorDetails();
  }

  addNewVendorDetails()
  {
      axiosInstance.post('/vendor/add/', this.state.newVendorDetailsData).then((response) => {
        //console.log(response.data);
        NotificationManager.success('Other Details Added Successfully!', '');
     });

     this.props.history.push("/app/cloud-office/vendor/add-vendors")
  }
 
  getAllVendorDetails()
  {
      axiosInstance.get('/vendor/getById/'+sessionStorage.getItem('vendorId')).then((response) => {
  
          this.setState({
           newVendorDetailsData: response.data
          
          })
      });
  }

   render(){

      return(

        <div className="textfields-wrapper">

        <RctCollapsibleCard heading="Vendor Other Details" customClasses="border border-info">
        <form noValidate autoComplete="off">
           
      <NotificationContainer />     

           <div className="row">
        
           <div className="col-sm-12 col-md-12 col-xl-12">
        
    <div className="row">
           <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="faxNo">Fax No.</Label>
           <Input id="faxNo" name="faxNo" value={this.state.newVendorDetailsData.faxNo} 
           onChange={(e) => 
           {
              let {newVendorDetailsData} = this.state;
              newVendorDetailsData.faxNo = e.target.value;
        
              this.setState({newVendorDetailsData});
           }} />
        </div>
        </div>
        
        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="panNo">PAN No.</Label>
           <Input id="panNo" name="panNo" value={this.state.newVendorDetailsData.panNo} 
           onChange={(e) => 
           {
              let {newVendorDetailsData} = this.state;
              newVendorDetailsData.panNo = e.target.value;
        
              this.setState({newVendorDetailsData});
           }} />
        </div>
        </div>

  {/*      
        <div className="col-sm-3 col-md-3 col-xl-3">
        <div className="form-group">
           <Label for="cstNo">CST No.</Label>
           <Input id="cstNo" name="cstNo" value={this.state.newVendorDetailsData.cstNo} 
           onChange={(e) => 
           {
              let {newVendorDetailsData} = this.state;
              newVendorDetailsData.cstNo = e.target.value;
        
              this.setState({newVendorDetailsData});
           }} />
        </div>
        </div>
   */}
        
        <div className="col-sm-4 col-md-4 col-xl-4">
        <div className="form-group">
           <Label for="gstNo">GST No.</Label>
           <Input id="gstNo" fullWidth label="gstNo" value={this.state.newVendorDetailsData.gstNo} 
           onChange={(e) => 
           {
              let {newVendorDetailsData} = this.state;
              newVendorDetailsData.gstNo = e.target.value;
        
              this.setState({newVendorDetailsData});
           }} />
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