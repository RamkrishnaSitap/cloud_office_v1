import React, { Component } from 'react';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
//import { Input } from '@material-ui/core';
import { Switch, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import axios from 'axios' ;
import MemberPreviousOrgForm from '../member-previous-org/memberPreviousOrgForm';
import MemberDocumentsForm from '../member-doc/memberDocumentsForm';
import { Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { MDBBtn } from 'mdbreact';
import color from '@material-ui/core/colors/orange';
import axiosInstance from '../../../../../../util/axiosInstance';
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class OrganizationalDetails extends Component
{

   constructor()
   {
      super();

      window.organizational_details = this;
   }

   state = {
     
      newMemberDetailsData: {

         memberDetailsId:'',

         memberType:'',
	      contractThrough:'',
	      contractorName:'',
	      plannedStartDate:'',
	      plannedEndDate:'',
	      //rate:'',
	      //pre:''
      },

      contractor: {
         contractorName: ''
      },

      contractorList: [],
      isContractorExist: true,
      showSuccessMsg: true,

      activeTab: '1',
    };

    componentWillMount()
    {
        this.getAllMemberDetails();
        this.getAllContractor();
    }

    //-----------------------------//
  
    toggle = (tab) => {
       
        this.setState({activeTab: tab});
    }
   
    //----------------------------//
  
    addNewMemberDetails()
    {
        axiosInstance.post('/member-details/add/', this.state.newMemberDetailsData).then((response) => {
          //console.log(response.data);
          NotificationManager.success('Organizational Details Saved Successfully!', '');
       });

       //window.member_previous_orgList.addNewMemberDetails();
    }
    
    getAllMemberDetails()
    {
        axiosInstance.get('/member-details/getById/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
            this.setState({
             newMemberDetailsData: response.data
            
            })
        });
    }

addContractor = () =>{

   axiosInstance.get('/contractor/getByName/'+this.state.contractor.contractorName).then(response => {
//alert('response : '+JSON.stringify(response.data))
         if(JSON.stringify(response.data).length === 2){

            this.setState({isContractorExist: true});
            this.setState({showSuccessMsg: false});
            //alert(this.state.contractor.contractorName)
            axiosInstance.post('/contractor/add/', this.state.contractor).then((response) => {
               console.log(response.data);
      
               this.getAllContractor();

               this.setState({
                  contractor: { contractorName: '' }
               });
      
            });

         }else{
            this.setState({showSuccessMsg: true});
            this.setState({isContractorExist: false});
         }

         NotificationManager.success('Contractor Added Successfully!', '');

      });

    }

    updateContractor = () =>{

      if(this.state.isContractorExist===false){
     
           axiosInstance.post('/contractor/update/', this.state.contractor).then((response) => {
              console.log(response.data);
     
              this.getAllContractor();
              NotificationManager.success('Contractor Updated Successfully!', '');
           });
        }else{
           alert('is value present')
        }
     
         }

    getAllContractor(){
      let tempContractorList = [];
      axiosInstance.get('/contractor/getAll').then((response) => {
   
             response.data.map(val => {
               tempContractorList.push(val.contractorName);
             });

             this.setState({contractorList: tempContractorList});
     });
     
    }

   render(){

 const contractorList = this.state.contractorList.map((val) => {
   return(
      <option value={val}> {val} </option>
    )
 });

      return(
         <div className="formelements-wrapper">
        
           <form noValidate autoComplete="off">

<NotificationContainer />

<RctCollapsibleCard heading="Current Organizational Details" customClasses="border border-info">
<div className="row">
   
<div className="col-sm-3 col-md-3 col-xl-3">
<div className="form-group">

  <Label for="memberType">Member Type</Label>
  
                                 <RadioGroup row id="memberType" name="memberType" value={this.state.newMemberDetailsData.memberType} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.memberType = e.target.value;
                                       this.setState({newMemberDetailsData});
                                 }}>
												<FormControlLabel value="Permanent" control={<Radio />} label="Permanent" />
												<FormControlLabel value="Temporary" control={<Radio />} label="Temporary" />
											</RadioGroup>

</div>
</div>

<div className="col-sm-3 col-md-3 col-xl-3">
<div className="form-group">
 
  <Label for="contractThrough">Contract Through</Label>
  
                                 <RadioGroup row id="contractThrough" name="contractThrough" value={this.state.newMemberDetailsData.contractThrough} 
                                 onChange={(e) => {
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.contractThrough = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }}>
												<FormControlLabel value="Self" control={<Radio />} label="Self" />
												<FormControlLabel value="Contractor" control={<Radio />} label="Contractor" />
											</RadioGroup>

</div>
</div>


<div className="col-sm-5 col-md-5 col-xl-5">
<div className="form-group">
  
<Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
            onClick={() => {this.toggle('1'), this.setState({showSuccessMsg: true, isContractorExist: true}) } }
          >
            Contractor Name
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '2' })}
            onClick={() =>  this.toggle('2')}
          >
            Add Contractor Name
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="1">
        <Row>
            <Col sm="12">
        <Label for="contractorName"> <span></span> </Label>
<Input type="select" name="contractorName" id="contractorName"   value={this.state.newMemberDetailsData.contractorName} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.contractorName = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }}>
                         <option>-select-</option>
                          {contractorList}
                         </Input>
</Col>
</Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="8">
            <Label for="contractorName"> <span></span> </Label>
               <Input type="text" name="contractorName" id="contractorName" placeholder="Contractor Name" 
               value={this.state.contractor.contractorName}

                                onChange={(e) => {
                                       let {contractor} = this.state;
                                       contractor.contractorName = e.target.value;
                                       this.setState({contractor});
                                 }} />
            </Col>
            <Col md="2" hidden={false}>
               <MDBBtn size="sm" className="Success" onClick={this.addContractor}>Add</MDBBtn>
            </Col>
            <Col md="2" hidden={true}>
               <MDBBtn size="sm" className="Success" onClick={this.updateContractor}>Update</MDBBtn>
            </Col>
          <center><span style={{color:"red", textAlign:"center"}} hidden={this.state.isContractorExist}>Already exist</span></center>
          <center><span style={{color:"green", textAlign:"center"}} hidden={this.state.showSuccessMsg}>Added Successfully</span></center>

         {/*   <Col md="2">
               <MDBBtn size="sm" className="Dengar">Delete</MDBBtn>
            </Col>
         */}   
          </Row>
        </TabPane>
      </TabContent>

</div>
</div>

</div>

<div className="row">

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
  <Label for="plannedStartDate">Planned Start Date</Label>
  <Input type="date" id="plannedStartDate" name="plannedStartDate" value={this.state.newMemberDetailsData.plannedStartDate} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.plannedStartDate = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }} />
</div>
</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
  <Label for="plannedEndDate">Planned End Date</Label>
  <Input type="date" id="plannedEndDate" name="plannedEndDate" value={this.state.newMemberDetailsData.plannedEndDate} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.plannedEndDate = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }} />
</div>
</div>

</div>

{/*
<div className="row">

<div className="col-sm-4 col-md-4 col-xl-4">

<div className="row">

<div className="col-sm-4 col-md-4 col-xl-4">    
<div className="form-group">
<Label for="Rate">Rate</Label>
  <Input id="rate" name="rate" value={this.state.newMemberDetailsData.rate} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.rate = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }} />
</div>
</div>
      

<div className="col-sm-4 col-md-4 col-xl-4">    
<div className="form-group">
<Label for="Rate"> <span></span> </Label>
<Input type="select" name="select" id="Select"  value={this.state.newMemberDetailsData.rate} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.rate = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }} >
                         <option>-select-</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                         </Input>

</div>
</div>

</div>

</div>

<div className="col-sm-4 col-md-4 col-xl-4">
<div className="form-group">
   <Label for="pre">Pre</Label>
                         <Input type="select" id="pre" name="pre" value={this.state.newMemberDetailsData.pre} 
                                 onChange={(e) => {
 
                                       let {newMemberDetailsData} = this.state;
                                       newMemberDetailsData.pre = e.target.value;
                                       this.setState({newMemberDetailsData})
                                 }} >
                         <option value="">-select-</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                         </Input>
</div>
</div>

</div>
*/}

</RctCollapsibleCard>

</form>

<MemberPreviousOrgForm/>
<MemberDocumentsForm/>

</div>


      );
   };

}