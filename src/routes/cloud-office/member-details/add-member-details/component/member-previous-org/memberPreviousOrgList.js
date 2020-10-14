import React, { Component } from "react";
import axios from 'axios';
import { IoIosAddCircle, IoIosRemoveCircle } from 'react-icons/io';
import { MDBBtn, MDBTooltip } from "mdbreact";
import { Tooltip, Zoom } from "@material-ui/core";
import { Label, Input } from 'reactstrap';
import axiosInstance from "../../../../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class MemberPreviousOrgList extends Component{

constructor()
{
   super();

   window.member_previous_orgList = this;
}

state = {

  temp_companyNames: [],
  temp_startDate: [],
  temp_endDate: [],
  temp_description: [],
  temp_ctc: [],

  newMemberDetailsData: {

     memberDetailsId:'',

     companyNames: [],
     startDate: [],
     endDate: [],
     description: [],
     ctc: [],
  }
};

componentWillMount()
{
    this.getAllMemberDetails();

    //this.addPN();
    //this.props.add();

   this.props.delete(this.props.memberPreviousOrgList[0]);
    //alert('OrgList : '+this.props.memberPreviousOrgList.length);
}

addNewMemberDetails()
{
 // this.props.add();
 // this.addPN();
if(!!!(this.state.temp_companyNames)===true || this.state.temp_companyNames.length === 1)
{
  //alert('is null')
  this.getMemberEmploymentList();
}

console.log('#addNewMemberDetails() :- '+this.state.temp_companyNames)
console.log(!!!(this.state.temp_companyNames))

  let {newMemberDetailsData} = this.state;
 
  newMemberDetailsData.companyNames = this.state.temp_companyNames;
  newMemberDetailsData.startDate = this.state.temp_startDate;
  newMemberDetailsData.endDate = this.state.temp_endDate;
  newMemberDetailsData.description = this.state.temp_description;
  newMemberDetailsData.ctc = this.state.temp_ctc;

  this.setState({newMemberDetailsData});

    axiosInstance.post('/member-details/add/', this.state.newMemberDetailsData).then((response) => {
      //console.log(response.data);
      NotificationManager.success('Pre-Organizational Details Added Successfully!', '');
   });
}

getAllMemberDetails()
    {
        axiosInstance.get('/member-details/getById/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
    
            this.setState({
             newMemberDetailsData: response.data
            })
        });
    }

    addPN = () =>{

      console.log('#addPN() : '+this.props.memberPreviousOrgList.length);
     // alert('#size: '+this.props.memberPreviousOrgList.length)
     this.props.memberPreviousOrgList.map((val, index) => {

      if(!!!(val.companyNames))
      {
        //alert("# IS NULL...");
        this.getMemberEmploymentList();
      }

      //alert("Val : "+val.companyNames)

      this.setState({
        temp_companyNames: this.state.temp_companyNames.concat(val.companyNames),
        temp_startDate: this.state.temp_startDate.concat(val.startDate),
        temp_endDate: this.state.temp_endDate.concat(val.endDate),
        temp_description: this.state.temp_description.concat(val.description),
        temp_ctc: this.state.temp_ctc.concat(val.ctc),
      });

     });

    }

    getMemberEmploymentList()
    {
        axiosInstance.get('/member-details/getMemberEmploymentDetailsList/byMemberId/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
    
        let index, companyNames, startDate, endDate, description;
//alert('OrgList : '+response.data);
       // let memberPreviousOrgList = [...prevState.memberPreviousOrgList, { index: Math.random(), companyNames: "", startDate: "", endDate: "", description: "" }];
     
      response.data.map((val, idx) => {
//alert(val.companyNames)
        //console.log(val.companyNames !== undefined+" : "+idx+" is null")
console.log(val.companyNames !== undefined)
        if(val.companyNames !== null || val.companyNames !== '' || val.companyNames !== undefined)
        {
          this.setState({
            temp_companyNames: this.state.temp_companyNames.concat(val.companyNames),
            temp_startDate: this.state.temp_startDate.concat(val.startDate),
            temp_endDate: this.state.temp_endDate.concat(val.endDate),
            temp_description: this.state.temp_description.concat(val.description),
            temp_ctc: this.state.temp_ctc.concat(val.ctc),
          });
        }

      });

      //this.props.add();
     console.log(this.state.temp_companyNames.length)
     

        });
    }

  render(){
  return (
  this.props.memberPreviousOrgList.map((val, idx) => {

      let companyNames = `companyNames-${idx}`, startDate = `startDate-${idx}`, endDate = `endDate-${idx}`, description = `description-${idx}`, ctc = `ctc-${idx}`
      
      return (
      
        <tr key={val.index}>
          <td>
          <div className="form-group">
            <Input type="text" name="companyNames" data-id={idx} id={companyNames} className="form-control" 
            value={val.companyNames} 
           onChange={(e) => {
             let companyNames = this.state;
             companyNames = e.target.value

             this.setState({companyNames})
           }}
            />
            </div>
          </td>

          <td>
          <div className="form-group">
            <Input type="date" name="startDate" id={startDate} data-id={idx} className="form-control " 
             value={val.startDate} 
             onChange={(e) => {
               let startDate = this.state;
               startDate = e.target.value
  
               this.setState({startDate})

             }} />
             </div>
          </td>
          <td>
          <div className="form-group">
            <Input type="date" name="endDate" id={endDate} data-id={idx} className="form-control"
             value={val.endDate} 
             onChange={(e) => {
               let endDate = this.state;
               endDate = e.target.value
  
               this.setState({endDate})
             }}
             />
             </div>
          </td>
          <td>
          <div className="form-group">
            <Input type="text" name="description" id={description} data-id={idx} className="form-control" 
             value={val.description} 
             onChange={(e) => {
               let description = this.state;
               description = e.target.value
  
               this.setState({description})
             }}
            />
             
            </div>
          </td>

          <td>
          <div className="form-group">
            <Input type="text" name="ctc" id={ctc} data-id={idx} className="form-control" 
             value={val.ctc} 
             onChange={(e) => {
               let ctc = this.state;
               ctc = e.target.value
  
               this.setState({ctc})
             }}
            />
            </div>
          </td>

          <td>
            {
              <div className="form-group">
               <MDBTooltip sm placement="top" TransitionComponent={Zoom}>
               <MDBBtn color="danger" onClick={(() => this.props.delete(val))}>
                  <IoIosRemoveCircle size="25px" style={{verticalAlign:"middle"}} />
               </MDBBtn>
                <div>Remove this row</div>
              </MDBTooltip>  
              </div>
            }
          </td>
        </tr >
      )
    })
  )
}
}
//export default MemberPreviousOrgList