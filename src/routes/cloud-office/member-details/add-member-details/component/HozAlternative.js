import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, TextareaAutosize, Tooltip, Zoom } from '@material-ui/core';
import PersonalDetails from './personal-info/personalDetails';
import AddressDetails from './address-details/addressDetails';
import LoginDetails from './login-details/loginDetails';
import OrganizationalDetails from './organizational-details/organizationalDetails';
import { FaChevronCircleRight, FaChevronCircleLeft } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';

function getSteps() {
   return ['Personal Details', 'Address Details', 'Login Details', 'Organizational Details'];
}

function getStepContent(stepIndex) {
   switch (stepIndex) {
      case 0:
         return <PersonalDetails/>;
      case 1:
         return <AddressDetails/>;
      case 2:
            return <LoginDetails/>;
      case 3:
            return <OrganizationalDetails/>    
      case 4:
         return 'This is the bit I really care about!';
      default:
         return 'Uknown stepIndex';
   }
}

export default class HorizontalLabelPositionBelowStepper extends Component {
  
functionPassed()
{
   this.props.sendFunction();
}

   state = {
      activeStep: 0,
   };

   handleNext = () => {


      const { activeStep } = this.state;

     if(activeStep === 0)
     {
       //window.personal_details.handleOnChange();
       window.personal_details.showValidateMsg();
       window.personal_details.addNewMemberDetails();
     }
     else if(activeStep === 1)
     {
       //window.address_details.handleOnChange();
       window.address_details.showValidateMsg();
       window.address_details.addNewMemberDetails();
     }
     else if(activeStep === 2)
     {
       window.login_details.addNewMemberDetails();
     }
     else if(activeStep === 3)
     {
       window.organizational_details.addNewMemberDetails();
       window.member_previous_orgList.addNewMemberDetails();
     }

     if(sessionStorage.getItem('isFormValid')==='true'){
      this.setState({
         activeStep: activeStep + 1
      });
   }
   
   };

   handleBack = () => {
      //alert('activeStep')
      //sessionStorage.setItem('isFormValid', true);
      const { activeStep } = this.state;
      this.setState({
         activeStep: activeStep - 1,
      });
   };

   handleReset = () => {
      this.setState({
         activeStep: 0,
      });

      sessionStorage.removeItem('MEMBER_ID');
      sessionStorage.removeItem('USER_EDIT_ID');

      this.onClick();
   };

   onClick = () => this.props.history.push("/app/cloud-office/member-details/show-member-details");

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
                       <Button variant="contained" className="btn-danger text-white mr-10 mb-10" 
                            onClick={ activeStep != 0 ? this.handleBack : ''}>
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
                 {/*       <Button variant="contained" className="btn-danger text-white mr-10 mb-10" disabled={activeStep === 0} onClick={this.handleBack} 
                         >
                           <FaChevronCircleLeft size="20px" /> &nbsp; 
                        </Button>
               */}
<center>               
                     <Tooltip title="Back" TransitionComponent={Zoom} placement="top" arrow>
                       <Button variant="contained" className="btn-danger text-white mr-10 mb-10" 
                               onClick={ activeStep != 0 ? this.handleBack : ''} disabled={activeStep===0}>
                            &nbsp; <FaChevronCircleLeft size="20px"/> &nbsp; Back
                        </Button>
                     </Tooltip>

                     <Tooltip title="Next" TransitionComponent={Zoom} placement="top" arrow>
                        <Button variant="contained" color="primary" className="text-white mr-10 mb-10" 
                        onClick={ this.handleNext}>
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
