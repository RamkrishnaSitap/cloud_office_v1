import React,{ Component } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Pagination from "react-js-pagination";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { IoIosAddCircle } from 'react-icons/io';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import DataTable from "../../../components/CustomComponent/DataTable/DataTable";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter } from "mdbreact";
import axiosInstance from "../../../util/axiosInstance";

class MemberDetails extends Component
{

state = {

    activePage:1,
    itemsCountPerPage:1,
    totalItemsCount:0,
    pageNumber:1,
    showTotalEntries:10,

    searchValue:'',

    tbaleRecordMsg:'No records found',

    memberDetails: [],
    newMemberDetailsData: {
        userName:'',
        emailId:'',
        memberStatus:'',
        communityOrDivisionName:'',
        createdBy:''
    },

    editMemberDetailsData: {
        memberDetailsId:'',
        userName:'',
        emailId:'',
        memberStatus:'',
        communityOrDivisionName:'',
        createdBy:''
    },
    newMemberDetailsModel: false,
    editMemberDetailsModel: false,

    resourcePermission: {
      add: false,
      update: false,
      delete: false,
    },

    modal : false,
}

componentWillMount()
{
    this.getAllMemberDetails();
   // this.handlePageChange.bind(1);
   this.updateResourcePermission();
}

updateResourcePermission(){
  var USER_ROLE = {};

  if (typeof sessionStorage.USER_ROLE !== "undefined") {
    USER_ROLE = JSON.parse(sessionStorage.USER_ROLE);
  }

  
  let resourcePermission = this.state.resourcePermission;

  resourcePermission.add = (USER_ROLE[1].addPermission === 'Y')? false : true;
  resourcePermission.update = (USER_ROLE[1].modifyPermission === 'Y')? false : true;
  resourcePermission.delete = (USER_ROLE[1].deletePermission === 'Y')? false : true;
  
  this.setState(resourcePermission);

  console.log('#USER_ROLE : ResourceName = '+JSON.stringify(USER_ROLE[1].resourceName))
  console.log('#USER_ROLE : Add = '+JSON.stringify(USER_ROLE[1].addPermission))
  console.log('#USER_ROLE : Update = '+JSON.stringify(USER_ROLE[1].modifyPermission))
  console.log('#USER_ROLE : Delete = '+JSON.stringify(USER_ROLE[1].deletePermission))

  
}

toggleNewMemberDetailsModel()
{
  this.setState({
     newMemberDetailsModel: ! this.state.newMemberDetailsModel

  });
}

toggleEditMemberDetailsModel()
{
  this.setState({
     editMemberDetailsModel: ! this.state.editMemberDetailsModel
  });
}

addMemberDetails()
{
    console.log("#addMemberDetails() : "+this.state.newMemberDetailsData.userName);
   axiosInstance.post('/member-details/add', this.state.newMemberDetailsData).then((response) => {
   //console.log(response.data);

    let {memberDetails} = this.state;

    memberDetails.push(response.data);

    this.setState({ 
        memberDetails, 
        newMemberDetailsModel: false, 

        newMemberDetailsData:{
            userName:'',
            emailId:'',
            memberStatus:'',
            communityOrDivisionName:'',
            createdBy:'',
    } 

});

   });

}

updateMemberDetails()
{
    axiosInstance.put('/member-details/update', this.state.editMemberDetailsData).then((response) =>{

        this.getAllMemberDetails();
    });
}

deleteMemberDetails(memberDetailsId)
{
    axiosInstance.delete('/member-details/delete/'+memberDetailsId).then((response) => {

        this.getAllMemberDetails();
    });

    this.setState({ modal: !this.state.modal });
}

getAllMemberDetails()
{

  let list = [];

    axiosInstance.get('/member-details/getAll').then((response) => {

      response.data.map(val => {

       list.push({
        memberName: val.memberName,
        email: val.email,
        memberStatus: val.memberStatus,
        userRole: val.userRole,
         action: [
                   <MDBBtn rounded color="cyan" onClick={this.onClick.bind(this, val.memberDetailsId)} disabled={this.state.resourcePermission.update}> <FaEdit /> </MDBBtn>,
                   <MDBBtn rounded color="danger" onClick={this.toggle(val.memberDetailsId)} disabled={this.state.resourcePermission.delete}> <FaTrash /> </MDBBtn>
                 ]
       });

      })

      this.setState({memberDetails : list})

    });
}

onClick = (memberDetailsId) => {
sessionStorage.setItem('USER_EDIT_ID', memberDetailsId);
this.props.history.push("/app/cloud-office/member-details/add-member-details");
}

handlePageChange(pageNumber) {

     this.getAllMemberDetails(pageNumber,this.state.showTotalEntries);

    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }

  handleShowEntries = (event) =>
  {
      let showTotalEntries = event.target.value;
      this.getAllMemberDetails(this.state.pageNumber, showTotalEntries);
  }

  handleSearchEntries = (event) =>
  {
      let searchValue = event.target.value;

      this.setState({searchValue:searchValue});

      axiosInstance.get('/member-details/searchMemberDetails/'+searchValue).then((response) => {

       this.setState({memberDetails: response.data}); 
       
       if(response.data.length === 0)
       this.setState({tbaleRecordMsg:'No matching records found'});

        });

        if(searchValue === '')
        {
            this.getAllMemberDetails(this.state.pageNumber, this.state.showTotalEntries);
        }
  }

  toggle = nr => () => {
  
    let {newMemberDetailsData} = this.state;
    newMemberDetailsData.memberDetailsId = nr;
    this.setState(newMemberDetailsData);
  
    this.setState({
      modal: !this.state.modal
    });
  }

    render(){
      
        const columns = [
            {
              label: 'User Name',
              field: 'memberName',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Email Id',
              field: 'email',
              sort: 'asc',
              width: 270
            },
            {
                label: 'User Status',
                field: 'memberStatus',
                sort: 'asc',
                width: 270
              },
              {
                label: 'User Role',
                field: 'userRole',
                sort: 'asc',
                width: 270
              },
            {
              label: 'Action',
              field: 'action',
              sort: 'asc',
              width: 270
            },
          ];


return(

<div className="formelements-wrapper">
  <RctCollapsibleCard heading="All User Details">

  <MDBBtn color="primary" onClick={this.onClick.bind(this, 0)} disabled={this.state.resourcePermission.add}> 
      <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} /> 
      Add User
  </MDBBtn>

<DataTable name="UserRole" columns={columns} rows={this.state.memberDetails} />

<MDBModal isOpen={this.state.modal} toggle={this.toggle(0)} size="sm" centered>
        <MDBModalBody className="text-center">
         Are sure you want to delete this record?
        </MDBModalBody>
        <MDBModalFooter className="text-center">
          <MDBBtn color="danger" size="sm" onClick={() => this.deleteMemberDetails(this.state.newMemberDetailsData.memberDetailsId)}>Yes</MDBBtn>
          <MDBBtn color="blue-grey" size="sm" onClick={this.toggle(0)}>No</MDBBtn>
        </MDBModalFooter>
      </MDBModal>

</RctCollapsibleCard>
       </div>

        )
    }
}

export default MemberDetails;


