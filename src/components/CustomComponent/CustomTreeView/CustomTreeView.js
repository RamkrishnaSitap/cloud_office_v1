import React, { Component } from 'react';
import { MDBContainer, MDBCol, MDBTreeview, MDBTreeviewList, } from 'mdbreact';
import { Checkbox } from '@material-ui/core';
import { FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import color from '@material-ui/core/colors/cyan';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { bgcolor } from '@material-ui/system';
import axiosInstance from '../../../util/axiosInstance';

class CustomTreeView extends Component {

    constructor()
    {
      super();
     // const  userRoleId = '';
     window.custom_tree_view = this;
    }
    
 state = {

    userRoleId: 0,
    isMsgShow: true,
    isMasterResourceOpen: false,
    isOtherResourceOpen: false,

    previousIndex: 0,

    userRoles: [],

    resources: [],

    masterResource: [

        {
          userRoleId: '',
            isOpen: false,
            resourceName: 'User Role',
            permission: [
   
                 { Per: 'ADD', ADD: false },
                 { Per: 'MODIFY', MODIFY: false },
                 { Per: 'DELETE', DELETE: false },
            ]
        },
        {
          isOpen: false,
          resourceName: 'User Details',
          permission: [
 
               { Per: 'ADD', ADD: false },
               { Per: 'MODIFY', MODIFY: false },
               { Per: 'DELETE', DELETE: false },
          ]
      },
      {
        isOpen: false,
        resourceName: 'Department',
        permission: [

             { Per: 'ADD', ADD: false },
             { Per: 'MODIFY', MODIFY: false },
             { Per: 'DELETE', DELETE: false },
        ]
    },
    {
      isOpen: false,
      resourceName: 'Vendor',
      permission: [

           { Per: 'ADD', ADD: false },
           { Per: 'MODIFY', MODIFY: false },
           { Per: 'DELETE', DELETE: false },
      ]
  },
  {
    isOpen: false,
    resourceName: 'Material',
    permission: [

         { Per: 'ADD', ADD: false },
         { Per: 'MODIFY', MODIFY: false },
         { Per: 'DELETE', DELETE: false },
    ]
},

    ], // master resource end

    otherResource: [

      {
          resourceName: 'Home',
          permission: [
 
               { Per: 'ADD', ADD: false },
               { Per: 'MODIFY', MODIFY: false },
               { Per: 'DELETE', DELETE: false },
          ]
      },
    {
      resourceName: 'Contact',
      permission: [

           { Per: 'ADD', ADD: false },
           { Per: 'MODIFY', MODIFY: false },
           { Per: 'DELETE', DELETE: false },
      ]
  },
   
     ], // other resource end
  }

  componentWillMount()
{
     //alert('componentWillMount : '+sessionStorage.getItem('USER_ROLE_ID'));
      //this.getAllUserRole();
      this.getAllUserPermissionByUserRoleId(sessionStorage.getItem('USER_ROLE_ID'));
     // this.getAllResources();
   /*  this.setState = (state,callback)=>{
      return;
  }; */
  
}

  getAllUserPermissionByUserRoleId(userRoleId)
{
  //alert('#getAllUserPermissionByUserRoleId() : '+userRoleId)
  let {masterResource} = this.state;
  var add_val=false, modify_val=false, delete_val=false;

  sessionStorage.setItem('USER_ROLE_ID', userRoleId);
  sessionStorage.removeItem('USER_ROLE');
  axiosInstance.get('/access-permission/getAllUserPermissionByUserRoleId/'+userRoleId).then((response) => {

    sessionStorage.setItem('USER_ROLE', JSON.stringify(response.data));

    if(response.data.length === 0)
    {
      this.state.masterResource.map((item, index) => {

      masterResource[index].permission[0].ADD = add_val;
      masterResource[index].permission[1].MODIFY = modify_val;
      masterResource[index].permission[2].DELETE = delete_val;  
      this.setState(masterResource);
    });

    }// if end
   
         response.data.map((value, index) => {
//alert(value.resourceName)
          if(value.addPermission === 'Y')
             {
               add_val = true;
             }

          if(value.modifyPermission === 'Y')
             {
               modify_val = true;
             }
             
          if(value.deletePermission === 'Y')
             {
               delete_val = true;
             }
    
      masterResource[index].resourceName = value.resourceName;
      masterResource[index].isOpen = false;

      masterResource[index].permission[0].ADD = add_val;
      masterResource[index].permission[1].MODIFY = modify_val;
      masterResource[index].permission[2].DELETE = delete_val;  

      this.setState(masterResource);

      add_val=false, modify_val=false, delete_val=false;
  });
});

//window.user_role.updateResourcePermission();

}

getAllUserRole()
{
    axiosInstance.get('/user-role/getAll').then((response) => {

        this.setState({userRoles: response.data});
    });

}

setPermission = (value) =>
{

let {masterResource} = this.state;

if(value[2] === 'ADD' && value[3] === false){
  masterResource[value[0]].permission[0].ADD = true;
}else if(value[2] === 'ADD' && value[3] === true)
{
  masterResource[value[0]].permission[0].ADD = false;
}

if(value[2] === 'MODIFY' && value[3] === false){
  masterResource[value[0]].permission[1].MODIFY = true;
}else if(value[2] === 'MODIFY' && value[3] === true){
  masterResource[value[0]].permission[1].MODIFY = false;
}

if(value[2] === 'DELETE' && value[3] === false)
{
  masterResource[value[0]].permission[2].DELETE = true;
}else if(value[2] === 'DELETE' && value[3] === true){
  masterResource[value[0]].permission[2].DELETE = false;
}
 
this.setState(masterResource);

this.openAndcloseResource(value[0], value[4]);
//this.getAllPermissions();

} 

openAndcloseResource(index, resourceName)
{
    this.setState({previousIndex: index});

    if(resourceName === 'masterResource')
    {
        this.setState({isMasterResourceOpen: true});
    
        let {masterResource} = this.state;
        masterResource[this.state.previousIndex].isOpen = false;
        masterResource[index].isOpen = true;
        this.setState(masterResource);
    }
   else if(resourceName === 'otherResource')
    {
        this.setState({isOtherResourceOpen: true});
    
        let {otherResource} = this.state;
        otherResource[this.state.previousIndex].isOpen = false;
        otherResource[index].isOpen = true;
        this.setState(otherResource);
    }
}

addPermissions(userRoleId)
{
  //alert('addPermissions() : '+userRoleId);
  let {masterResource} = this.state;
  masterResource[0].userRoleId = userRoleId;
  this.setState(masterResource);
  axiosInstance.post('/access-permission/addPermission', this.state.masterResource).then((response) => {

    //alert(response.data.userRole.userRoleId);
    //this.getAllUserPermissionByUserRoleId(this.state.userRoleId);
    this.getAllUserPermissionByUserRoleId(userRoleId);
  });
  //sessionStorage.setItem('USER_ROLE_ID', 0);
}

handleChange = (event) =>
{
    let {masterResource} = this.state;
    masterResource[this.state.previousIndex].isOpen = false;
    this.setState(masterResource);

  var userRoleId = event.target.value;

  if(userRoleId != 0)
  {
    this.setState({isMsgShow: true});
  }

  this.getAllUserPermissionByUserRoleId(userRoleId);
  this.setState({userRoleId: userRoleId});
}

getAllPermissions()
{
   //let action = this.state;

    axiosInstance.get('/access-permission/getAllUserPermissionByUserId/'+localStorage.getItem('USER_ID')).then((responce) => {

    localStorage.setItem('USER_PERMISSION', JSON.stringify(responce.data));
    
    });
}

getAllResources(){
  let resources_temp = [];
  let {masterResource} = this.state;
  axiosInstance.get('/resource/getAll').then((responce) => {

     responce.data.map((val,idx) => {
      //alert('resourceName : '+val.resourceName);
      masterResource[idx].resourceName = val.resourceName;

     });
     this.setState(masterResource);
    });

}

  render() {

    
    //alert('this.state.masterResource.length : '+this.state.masterResource.length)
    //alert('masterResource[index].permission[0].ADD : '+this.state.masterResource[0].permission[0].ADD)
    const permissionMasterResource = this.state.masterResource.map((item, index) => {
  console.log(item.resourceName+" = "+item.permission[0].ADD+", "+item.permission[1].MODIFY+", "+item.permission[2].DELETE)

        return(
        
       <MDBTreeviewList icon='shield-alt' title={item.resourceName} opened={item.isOpen}>
                <Label> {item.permission[0].Per} <Checkbox checked={item.permission[0].ADD} onChange={ this.setPermission.bind(this, [index, item.resourceName, item.permission[0].Per, item.permission[0].ADD, 'masterResource'] ) } /> </Label>
                <Label> {item.permission[1].Per} <Checkbox checked={item.permission[1].MODIFY} onChange={ this.setPermission.bind(this, [index, item.resourceName, item.permission[1].Per, item.permission[1].MODIFY, 'masterResource'] )} /> </Label>
                <Label> {item.permission[2].Per} <Checkbox checked={item.permission[2].DELETE} onChange={ this.setPermission.bind(this, [index, item.resourceName, item.permission[2].Per, item.permission[2].DELETE, 'masterResource'] )} /> </Label>
       </MDBTreeviewList>

        )

    });

    const permissionOtherResource = this.state.otherResource.map((item,index) => {

        return(

       <MDBTreeviewList icon='envelope-open' title={item.resourceName} far>
                <Label> {item.permission[0].Per} <Checkbox checked={item.permission[0].ADD} onChange={ this.setPermission.bind(this, [item.resourceName, item.permission[0].Per, item.permission[0].ADD] ) } /> </Label>
                <Label> {item.permission[1].Per} <Checkbox checked={item.permission[1].MODIFY} onChange={ this.setPermission.bind(this, [item.resourceName, item.permission[1].Per, item.permission[1].MODIFY] )} /> </Label>
                <Label> {item.permission[2].Per} <Checkbox checked={item.permission[2].DELETE} onChange={ this.setPermission.bind(this, [item.resourceName, item.permission[2].Per, item.permission[2].DELETE] )} /> </Label>
       </MDBTreeviewList>

        )

    });

    const userRoleData =  this.state.userRoles.map((val) => {

        return(
          <option value={val.userRoleId}> {val.userRole} </option>
        )
   
        });


    return (
 
      <div className="row">
      <div className="col-md-12">

      <RctCollapsibleCard>
{/*
    <Label>Select User Role</Label>  
    <select className="form-control" onChange={this.handleChange}>
    <option value={0}>-select-</option>
     {userRoleData}
    </select>

<Label hidden={this.state.isMsgShow} style={{color:'red'}}> *Please select user role! </Label>

    <br></br>
*/}  
      <MDBContainer header='Animated'>
        <MDBCol md='100'>
          <MDBTreeview
            theme='animated'
            header='User Permission'
            className='border-info w-100 h-100'
            getValue={value => console.log(value)}
          >

        <MDBTreeviewList style={{marginTop:-30}} icon='server' title='Master' opened={this.state.isMasterResourceOpen}>

        {/* <Label> <Checkbox  /> AddAll </Label>
            <Label> <Checkbox /> ModifyAll </Label>
            <Label> <Checkbox /> DeleteAll </Label>
        */}
            {permissionMasterResource} 
        </MDBTreeviewList>     

        <MDBTreeviewList icon='envelope-open' title='Other' far>

        {/* <Label> <Checkbox  /> AddAll </Label>
            <Label> <Checkbox /> ModifyAll </Label>
            <Label> <Checkbox /> DeleteAll </Label>
        */}
            
           {permissionOtherResource}          
        </MDBTreeviewList>

          </MDBTreeview>
        </MDBCol>
      </MDBContainer>

      </RctCollapsibleCard>
      </div>
  </div>
    );
  }
}

export default CustomTreeView;