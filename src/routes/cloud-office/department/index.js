import React,{ Component } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { IoIosAddCircle, IoIosCloseCircle } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MDBBtn, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBModal, MDBNotification } from "mdbreact";
import DataTable from "../../../components/CustomComponent/DataTable/DataTable";
import axiosInstance from "../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

class Department extends Component
{

state = {

    activePage:1,
    itemsCountPerPage:1,
    totalItemsCount:0,
    pageNumber:1,
    showTotalEntries:10,

    searchValue:'',

    departments: [],
    newDepartmentData: {
        deptName:'',
        deptDescription:'',
    },

    editDepartmentData: {
        deptId:'',
        deptName:'',
        deptDescription:'',
    },
    newDepartmentModel: false,
    editDepartmentModel: false,

    resourcePermission: {
      add: false,
      update: false,
      delete: false,
    },

    modal : false,
}

componentWillMount()
{
    this.getAllDepartments();
    this.updateResourcePermission();
}

updateResourcePermission(){
  var USER_ROLE = {};

  if (typeof sessionStorage.USER_ROLE !== "undefined") {
    USER_ROLE = JSON.parse(sessionStorage.USER_ROLE);
  }

  
  let resourcePermission = this.state.resourcePermission;

  resourcePermission.add = (USER_ROLE[2].addPermission === 'Y')? false : true;
  resourcePermission.update = (USER_ROLE[2].modifyPermission === 'Y')? false : true;
  resourcePermission.delete = (USER_ROLE[2].deletePermission === 'Y')? false : true;
  
  this.setState(resourcePermission);

  console.log('#USER_ROLE : ResourceName = '+JSON.stringify(USER_ROLE[2].resourceName))
  console.log('#USER_ROLE : Add = '+JSON.stringify(USER_ROLE[2].addPermission))
  console.log('#USER_ROLE : Update = '+JSON.stringify(USER_ROLE[2].modifyPermission))
  console.log('#USER_ROLE : Delete = '+JSON.stringify(USER_ROLE[2].deletePermission))

}

toggleNewDepartmentModel()
{
  this.setState({
     newDepartmentModel: ! this.state.newDepartmentModel
  });
}

toggleEditDepartmentModel()
{
  this.setState({
     editDepartmentModel: ! this.state.editDepartmentModel
  });
}

getAllDepartments()
{

  let list = [];
//console.log('#config : '+config)
  //alert(sessionStorage.getItem('token_id'))
  //const baseURL = process.env.REACT_APP_BASE_URL;

  axiosInstance.get('/department/getAll').then(response => {

    response.data.map(val => {

     list.push({
      deptName: val.deptName,
      deptDescription: val.deptDescription,
       action: [
                 <MDBBtn rounded color="cyan" onClick={this.editDepartment.bind(this, val.deptId,val.deptName,val.deptDescription)} disabled={this.state.resourcePermission.update}> <FaEdit /> </MDBBtn>,
                 <MDBBtn rounded color="danger" onClick={this.toggle(val.deptId)} disabled={this.state.resourcePermission.delete}> <FaTrash /> </MDBBtn>
               ]
     });

    })

    this.setState({departments : list});

  }).catch(error => {
    //alert('ERROR : '+error.response.status)
  });

  return false;
}

addDepartment()
{
   axiosInstance.post('http://localhost:8080/cloudoffice/department/add', this.state.newDepartmentData).then((response) => {
   
   this.getAllDepartments();
   NotificationManager.success('Department Added Successfully!', '');

    this.setState({ 
        departments: [], 
        newDepartmentModel: false, 

        newDepartmentData:{
            deptName:'',
            deptDescription:'',
    } 

});
  
   });

}

editDepartment(deptId, deptName, deptDescription)
{
     //console.log('#editDepartment() : '+deptId, deptName, deptDescription)

     this.setState({
    
        editDepartmentModel: ! this.state.editDepartmentModel,

        editDepartmentData:{

          deptId, deptName, deptDescription
        },
    
	 });
}


updateDepartment(){

    axiosInstance.put('/department/update', this.state.editDepartmentData).then((response) =>{

        this.getAllDepartments();
        NotificationManager.success('Department Updated Successfully!', '');
    });
}

deleteDepartment = (deptId) =>{
  
    axiosInstance.delete('/department/delete/'+deptId).then((response) => {

        this.getAllDepartments();
        NotificationManager.success('Department Deleted Successfully!', '');

    });

    this.setState({ modal: !this.state.modal });
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

     axiosInstance.get('/cloudoffice/member-details/searchDepartment/'+searchValue).then((response) => {

           this.setState({
               memberDetails: response.data
          });
       });
 }

 toggle = nr => () => {
  
  let {newDepartmentData} = this.state;
  newDepartmentData.deptId = nr;
  this.setState(newDepartmentData);

  this.setState({
    modal: !this.state.modal
  });
}

    render(){

      const columns = [
        {
          label: 'Department Name',
          field: 'deptName',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Department Description',
          field: 'deptDescription',
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
  <RctCollapsibleCard heading="All Departments">
    
      <MDBBtn color="primary" onClick={this.toggleNewDepartmentModel.bind(this)} disabled={this.state.resourcePermission.add}> 
      <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} /> 
        Add Department
      </MDBBtn>

      <Modal isOpen={this.state.newDepartmentModel} toggle={this.toggleNewDepartmentModel.bind(this)}>
        <ModalHeader toggle={this.toggleNewDepartmentModel.bind(this)}>Add a new department</ModalHeader>
      <ModalBody>
        
<FormGroup>

<div className="form-group">    
<Label for="deptName">Department Name</Label>
<Input type="text" name="deptName" id="deptName" 
placeholder="enter department name" 

value={this.state.newDepartmentData.deptName} 

onChange={(e) => { 

    let {newDepartmentData} = this.state;

    newDepartmentData.deptName = e.target.value;

    this.setState({newDepartmentData});
 }}
/>
</div>

<div className="form-group">
<Label for="deptDescription">Department Description</Label>
<Input type="text" name="deptDescription" id="deptDescription" placeholder="enter department description"

value={this.state.newDepartmentData.deptDescription}

onChange={(e) => {

    let {newDepartmentData} = this.state;

    newDepartmentData.deptDescription = e.target.value;

    this.setState({newDepartmentData});
}}
/>
</div>

</FormGroup>

        </ModalBody>
        <ModalFooter>
        
          <MDBBtn color="success" onClick={this.addDepartment.bind(this)}>
          <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} />
          Add 
          </MDBBtn>{' '}
          <MDBBtn color="blue-grey" onClick={this.toggleNewDepartmentModel.bind(this)}>
          <IoIosCloseCircle size="25px" style={{verticalAlign:"middle"}} />
          Cancel 
          </MDBBtn>

        </ModalFooter>
      </Modal>

<Modal isOpen={this.state.editDepartmentModel} toggle={this.toggleEditDepartmentModel.bind(this)}>
        <ModalHeader toggle={this.toggleEditDepartmentModel.bind(this)}>Edit a department</ModalHeader>
        <ModalBody>
        
<FormGroup>

<div className="form-group">
<Label for="deptName">Department Name</Label>
<Input type="text" name="deptName" id="deptName" 
placeholder="enter department name" 

value={this.state.editDepartmentData.deptName} 

onChange={(e) => { 

    let {editDepartmentData} = this.state;

    editDepartmentData.deptName = e.target.value;

    this.setState({editDepartmentData});
 }}
/>
</div>

<div className="form-group">
<Label for="deptDescription">Department Description</Label>
<Input type="text" name="deptDescription" id="deptDescription" placeholder="enter department description"

value={this.state.editDepartmentData.deptDescription}

onChange={(e) => {

    let {editDepartmentData} = this.state;

    editDepartmentData.deptDescription = e.target.value;

    this.setState({editDepartmentData});
}}
/>
</div>

</FormGroup>

        </ModalBody>
        <ModalFooter>
        
          <MDBBtn color="success" onClick={this.updateDepartment.bind(this)}>
          <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} />
          Update 
          </MDBBtn>{' '}
          <MDBBtn color="blue-grey" onClick={this.toggleEditDepartmentModel.bind(this)}>
          <IoIosCloseCircle size="25px" style={{verticalAlign:"middle"}} />
          Cancel 
          </MDBBtn>

        </ModalFooter>
      </Modal>

      <DataTable name="Department" columns={columns} rows={this.state.departments} />

      <NotificationContainer />

      <MDBModal isOpen={this.state.modal} toggle={this.toggle(0)} size="sm" centered>
        <MDBModalBody className="text-center">
         Are sure you want to delete this record?
        </MDBModalBody>
        <MDBModalFooter className="text-center">
          <MDBBtn color="danger" size="sm" onClick={() => this.deleteDepartment(this.state.newDepartmentData.deptId)}>Yes</MDBBtn>
          <MDBBtn color="blue-grey" size="sm" onClick={this.toggle(0)}>No</MDBBtn>
        </MDBModalFooter>
      </MDBModal>

</RctCollapsibleCard>
     </div>

        )
    }
}

export default Department;