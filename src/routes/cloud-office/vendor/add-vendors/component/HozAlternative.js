import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Label, Input } from 'reactstrap';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize, Tooltip, Zoom } from '@material-ui/core';

import axios from 'axios' ;
import Moment from 'react-moment';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
import VendorPersonalDetails from './vendorPersonalDetails';
import VendorOtherDetails from './vendorOtherDetails';
import VendorPermanentAddressDetails from './vendorPermentAddressDetails';
import { FaChevronCircleRight, FaChevronCircleLeft } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';

function getSteps() {
   return ['Personal Details', 'Address Details', 'Other Details'];
}

function getStepContent(stepIndex) {
   switch (stepIndex) {
      case 0:
         return <VendorPersonalDetails/>;
      case 1:
            return <VendorPermanentAddressDetails/>;
      case 2:
            return <VendorOtherDetails/>    
      case 3:
         return 'This is the bit I really care about!';
      default:
         return 'Uknown stepIndex';
   }
}

export default class HorizontalLabelPositionBelowStepper extends Component {
  
constructor()
{
   super()
  //this.functionPassed = this.functionPassed.bind(this);
}

functionPassed()
{
   this.props.sendFunction();
}

   state = {
      activeStep: 0,

		genderRadio1: 'male',
		genderRadio2: 'male',
		genderRadio3: 'male'
   };

   handleNext = () => {

      const { activeStep } = this.state;

     if(activeStep === 0)
     {
      window.vendor_personal_details.showValidateMsg();
       window.vendor_personal_details.addNewVendorDetails();
     }
     else if(activeStep === 1)
     {
       window.vendor_permanent_address_details.addNewVendorDetails();
     }
     else if(activeStep === 2)
     {
       window.vendor_other_details.addNewVendorDetails();
      // onClick = () => this.props.history.push("/app/cloud-office/vendor/show-vendors");
     }

     if(sessionStorage.getItem('isFormValid')==='true'){
      this.setState({
         activeStep: activeStep + 1,
      });
     }

   };

   handleBack = () => {
      const { activeStep } = this.state;
      this.setState({
         activeStep: activeStep - 1,
      });
   };

   handleReset = () => {
      this.setState({
         activeStep: 0,
      });

      sessionStorage.setItem('vendorId', null);
   };

   render() {
      const steps = getSteps();
      const { activeStep } = this.state;

      return (
         <div>
            <Stepper activeStep={activeStep} alternativeLabel className="stepper-rtl">
               {steps.map(label => {
                  return (
                     <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                     </Step>
                  );
               })}
            </Stepper>
            <div>
               {this.state.activeStep === steps.length ? (
                  <div className="pl-40">
                     <p>All steps completed - you&quot;re finished</p>
<center>
                     <Tooltip title="Back" TransitionComponent={Zoom} placement="top" arrow>
                       <Button variant="contained" className="btn-danger text-white mr-10 mb-10" onClick={ activeStep != 0 ? this.handleBack : ''}>
                            &nbsp; <FaChevronCircleLeft size="20px" /> &nbsp; Back
                        </Button>
                     </Tooltip>

                     <Tooltip title="Finish" TransitionComponent={Zoom} placement="top" arrow>
                     <Button variant="contained" className="btn btn-success text-white mr-10 mb-10 align-items-center" onClick={this.handleReset}>
                        Done &nbsp; <IoMdDoneAll size="20px" style={{verticalAlign:"middle"}} />
                     </Button>
                     </Tooltip>
</center>                     
                  </div>
               ) : (
                     <div className="pl-40">
                        <p>{getStepContent(activeStep)}</p>
                 
                 {/*       <Button variant="contained" className="btn-danger text-white mr-10 mb-10" disabled={activeStep === 0} onClick={this.handleBack}>
                           Back
              </Button>
                        <Button variant="contained" color="primary" className="text-white mr-10 mb-10" onClick={ this.handleNext}>
                           {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
               */}
<center>
                     <Tooltip title="Back" TransitionComponent={Zoom} placement="top" arrow>
                       <Button variant="contained" className="btn-danger text-white mr-10 mb-10" onClick={ activeStep != 0 ? this.handleBack : ''}>
                            &nbsp; <FaChevronCircleLeft size="20px" /> &nbsp; Back
                        </Button>
                     </Tooltip>

                     <Tooltip title="Next" TransitionComponent={Zoom} placement="top" arrow>
                        <Button variant="contained" color="primary" className="text-white mr-10 mb-10" onClick={ this.handleNext}>
                           {activeStep === steps.length - 1 ? '' : ''} &nbsp; Next &nbsp; <FaChevronCircleRight size="20px" />
                        </Button>
                     </Tooltip> 
</center>
                     </div>
                  )
               
                  }
            </div>
         </div>
      );
   }
}
