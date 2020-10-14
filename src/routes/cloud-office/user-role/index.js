import React,{ Component } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { IoIosAddCircle, IoIosCloseCircle } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from "../../../components/CustomComponent/DataTable/DataTable";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter } from "mdbreact";
import ReactDOM from 'react-dom';
import { Multiselect } from 'multiselect-react-dropdown';
import CustomTreeView from "../../../components/CustomComponent/CustomTreeView/CustomTreeView";
import axiosInstance from "../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class UserRole extends Component{

  constructor(){
    super();

    window.user_role = this;
  }

state = {

    userRoles: [],

     newUserRoleData: {
	   userRole:'',
	   reportToLevel:'',
    },

    editUserRoleData: {
     userRoleId:'',
     userRole:'',
	   reportToLevel:'',
    },
    newUserRoleModel: false,
    editUserRoleModel: false,

    options: [], // multiSelectOptions
    multiSelectedOptions: [],

    selectedValue: [],

    resourcePermission: {
      add: false,
      update: false,
      delete: false,
    },

    modal : false,
}

componentWillMount()
{
    this.getAllUserRoles();
    this.updateResourcePermission();
}

updateResourcePermission(){
  var USER_ROLE = {};

  if (typeof sessionStorage.USER_ROLE !== "undefined") {
    USER_ROLE = JSON.parse(sessionStorage.USER_ROLE);
  }

  let resourcePermission = this.state.resourcePermission;

  resourcePermission.add = (USER_ROLE[0].addPermission === 'Y')? false : true;
  resourcePermission.update = (USER_ROLE[0].modifyPermission === 'Y')? false : true;
  resourcePermission.delete = (USER_ROLE[0].deletePermission === 'Y')? false : true;
  
  this.setState(resourcePermission);

  console.log('#USER_ROLE : ResourceName = '+JSON.stringify(USER_ROLE[0].resourceName))
  console.log('#USER_ROLE : Add = '+JSON.stringify(USER_ROLE[0].addPermission))
  console.log('#USER_ROLE : Update = '+JSON.stringify(USER_ROLE[0].modifyPermission))
  console.log('#USER_ROLE : Delete = '+JSON.stringify(USER_ROLE[0].deletePermission))

}

toggleNewUserRoleModel()
{
  sessionStorage.setItem('USER_ROLE_ID', 0);
  this.setState({selectedValue: []});

  this.setState({
     newUserRoleModel: ! this.state.newUserRoleModel
  });
}

toggleEditUserRoleModel()
{
  sessionStorage.setItem('USER_ROLE_ID', 0);
  
  this.setState({
     editUserRoleModel: ! this.state.editUserRoleModel
  });
}

getAllUserRoles()
{
  let list = [];
  let multiSelectOptions_temp = [];

    axiosInstance.get('/user-role/getAll').then((response) => {

      response.data.map(val => {

        //this.setState({selectedValue: multiSelectOptions});

       list.push({
         userRole: val.userRole,
         reportToLevel: val.reportToLevel,
         action: [
                   <MDBBtn rounded color="cyan" onClick={this.editUserRole.bind(this, val.userRoleId,val.userRole,val.reportToLevel)} > <FaEdit /> </MDBBtn>,
                   <MDBBtn rounded color="danger" onClick={this.toggle(val.userRoleId)} disabled={this.state.resourcePermission.delete}> <FaTrash /> </MDBBtn>
                 ]
       });

       multiSelectOptions_temp.push({name: val.userRole, id: val.userRoleId});

      })

      this.setState({userRoles : list});
      this.setState({options: multiSelectOptions_temp});

    });
}

addUserRole()
{
  let {newUserRoleData} = this.state;

  //alert('multiSelectedOptions : '+this.state.multiSelectedOptions)
  newUserRoleData.reportToLevel = this.state.multiSelectedOptions+'';
  this.setState(newUserRoleData);

   axiosInstance.post('/user-role/add', this.state.newUserRoleData).then((response) => {
   //console.log(response.data);

    //let {userRoles} = this.state;
    //userRoles.push(response.data);

    this.getAllUserRoles();
    NotificationManager.success('UserRole Added Successfully!', '');

    window.custom_tree_view.addPermissions(response.data.userRoleId);
    this.updateResourcePermission();
  
    newUserRoleData.userRole = '';
    newUserRoleData.reportToLevel = '';

    this.setState(newUserRoleData);

   });

   this.setState({
    newUserRoleModel: ! this.state.newUserRoleModel
 });

//alert('multiSelectedOptions : '+this.state.multiSelectedOptions.length)

}

editUserRole(userRoleId, userRole, reportToLevel)
{
    // console.log(userRoleId, userRole, reportToLevel)
    let selectedValue_temp = [];
    
    if(reportToLevel !== ''){
  
      let array_temp = reportToLevel.split(',');

      array_temp.map(val => {
       //console.log(val)
       selectedValue_temp.push({name: val, id: 0});
      });
  
    }
  
    this.setState({selectedValue: selectedValue_temp});

    
     this.setState({
    
        editUserRoleModel: ! this.state.editUserRoleModel,

        editUserRoleData:{

            userRoleId, userRole, reportToLevel
        },
   });

   //alert('editUserRole() : '+userRoleId)
   window.custom_tree_view.getAllUserPermissionByUserRoleId(userRoleId);
   this.updateResourcePermission();

}

updateUserRole()
{
  let {editUserRoleData} = this.state;
  let multiSelectedOptions_temp = [];

  if(this.state.multiSelectedOptions.length === 0){
       this.state.selectedValue.map((val, idx) => {
       multiSelectedOptions_temp.push(val.name);
       });
  }else{
    multiSelectedOptions_temp = this.state.multiSelectedOptions;
  }

  editUserRoleData.reportToLevel = multiSelectedOptions_temp+'';
  this.setState(editUserRoleData);

    axiosInstance.put('/user-role/update', this.state.editUserRoleData).then((response) =>{

      window.custom_tree_view.addPermissions(response.data.userRoleId);
      this.getAllUserRoles();
      NotificationManager.success('UserRole Updated Successfully!', '');

      this.updateResourcePermission();
    });

    this.setState({
      editUserRoleModel: ! this.state.editUserRoleModel
   });

   this.getPermission();
}

deleteUserRole(userRoleId)
{
    axiosInstance.delete('/user-role/delete/'+userRoleId).then((response) => {
     
    this.getAllUserRoles();
    NotificationManager.success('UserRole Deleted Successfully!', '');

    });

    this.setState({ modal: !this.state.modal });
}

onSelect = (selectedList, selectedItem) =>{
  
  let list = [];

  selectedList.map(val => {
    console.log('selectedList : '+val.name);
    list.push(val.name);
  });

  this.setState({multiSelectedOptions: list});

}

onRemove = (selectedList, selectedItem) =>{

  let list = [];

  selectedList.map(val => {
    console.log('selectedList : '+val.name);
    list.push(val.name);
  });

  this.setState({multiSelectedOptions: list});

}

getPermission(){
  //alert('getPermission() : ')
  axiosInstance.get('/access-permission/getAllUserPermissionByUserRoleId/'+sessionStorage.getItem('USER_ROLE_ID')).then((response) => {
     sessionStorage.setItem('USER_ROLE', JSON.stringify(response.data));
     this.updateResourcePermission();
  });
}

toggle = nr => () => {
  
  let {newUserRoleData} = this.state;
  newUserRoleData.userRoleId = nr;
  this.setState(newUserRoleData);

  this.setState({
    modal: !this.state.modal
  });
}

 render(){
 //alert('USER ROLE')
const columns = [
  {
    label: 'User Role',
    field: 'userRole',
    sort: 'asc',
    width: 150
  },
  {
    label: 'Report To Level',
    field: 'reportToLevel',
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
  <RctCollapsibleCard heading="All User Roles">


      <MDBBtn color="primary" onClick={this.toggleNewUserRoleModel.bind(this)}> 
      <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} /> 
      Add User Role
      </MDBBtn>

      <Modal isOpen={this.state.newUserRoleModel} toggle={this.toggleNewUserRoleModel.bind(this)}>
        <ModalHeader toggle={this.toggleNewUserRoleModel.bind(this)}> Add a new user role</ModalHeader>
      <ModalBody>
        
<FormGroup>
<div className="form-group">
<Label for="userRole">User Role</Label>
<Input type="text" name="userRole" id="userRole" 
placeholder="enter user role" 

value={this.state.newUserRoleData.userRole} 

onChange={(e) => { 

    let {newUserRoleData} = this.state;

    newUserRoleData.userRole = e.target.value;

    this.setState({newUserRoleData});
 }}
/>
</div>

<div className="form-group">
<Label for="reportToLevel">Report To Level</Label>

<Multiselect
options={this.state.options} // Options to display in the dropdown
selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="name" // Property name to display in the dropdown options
/>

</div>

<CustomTreeView updateResourcePermission={this.updateResourcePermission} />

</FormGroup>

        </ModalBody>
        <ModalFooter>

          <MDBBtn color="success" onClick={this.addUserRole.bind(this)}>
          <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} />
          Add 
          </MDBBtn>{' '}
          <MDBBtn color="blue-grey" onClick={this.toggleNewUserRoleModel.bind(this)}>
          <IoIosCloseCircle size="25px" style={{verticalAlign:"middle"}} />
          Cancel 
          </MDBBtn>
      
        </ModalFooter>
      </Modal>

{ /*-------------------------------------------------------------------------------------------------------*/ }

<Modal isOpen={this.state.editUserRoleModel} toggle={this.toggleEditUserRoleModel.bind(this)}>
        <ModalHeader toggle={this.toggleEditUserRoleModel.bind(this)}>Edit a userRole</ModalHeader>
        <ModalBody>
        
<FormGroup>
<div className="form-group">
<Label for="userRole">User Role</Label>
<Input type="text" name="userRole" id="userRole" 
placeholder="enter user role" 

value={this.state.editUserRoleData.userRole} 

onChange={(e) => { 

    let {editUserRoleData} = this.state;

    editUserRoleData.userRole = e.target.value;

    this.setState({editUserRoleData});
 }}
/>
</div>

<div className="form-group">
<Label for="reportToLevel">Report To Level</Label>

<Multiselect
options={this.state.options} // Options to display in the dropdown
selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="name" // Property name to display in the dropdown options
/>

</div>

<CustomTreeView/>

</FormGroup>

        </ModalBody>
        <ModalFooter>
         
          <MDBBtn color="success" onClick={this.updateUserRole.bind(this)}>
          <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} />
          Update 
          </MDBBtn>{' '}
          <MDBBtn color="blue-grey" onClick={this.toggleEditUserRoleModel.bind(this)}>
          <IoIosCloseCircle size="25px" style={{verticalAlign:"middle"}} />
          Cancel 
          </MDBBtn>

        </ModalFooter>
      </Modal>

    {/* <Msg name="MyTable" data={this.state.userRoles} /> */}

     <DataTable name="UserRole" columns={columns} rows={this.state.userRoles} />

     <NotificationContainer />

<MDBModal isOpen={this.state.modal} toggle={this.toggle(0)} size="sm" centered>
  <MDBModalBody className="text-center">
   Are sure you want to delete this record?
  </MDBModalBody>
  <MDBModalFooter className="text-center">
    <MDBBtn color="danger" size="sm" onClick={() => this.deleteUserRole(this.state.newUserRoleData.userRoleId)}>Yes</MDBBtn>
    <MDBBtn color="blue-grey" size="sm" onClick={this.toggle(0)}>No</MDBBtn>
  </MDBModalFooter>
</MDBModal>
    
</RctCollapsibleCard>
     </div>

        )
    }
}


//ReactDOM.render(<CustomTreeView/>, document.getElementById('root'));