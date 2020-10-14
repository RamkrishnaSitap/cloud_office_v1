import React,{ Component } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Pagination from "react-js-pagination";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { IoIosAddCircle } from 'react-icons/io';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter } from "mdbreact";
import DataTable from "../../../components/CustomComponent/DataTable/DataTable";
import axiosInstance from "../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

class Material extends Component
{

state = {

    material: [],
     newMaterialData: {

	    materialName:'',
	    quantity:'',
	    rate:''
    },

    editMaterialData: {

        materialId:'',

        serialNo:'',
	    materialName:'',
	    quantity:'',
	    rate:''
    },
    newMaterialModel: false,
    editMaterialModel: false,

    resourcePermission: {
      add: false,
      update: false,
      delete: false,
    },

    modal : false,
}

componentWillMount()
{
    this.getAllMaterial();
    this.updateResourcePermission();
}

updateResourcePermission(){
  var USER_ROLE = {};

  if (typeof sessionStorage.USER_ROLE !== "undefined") {
    USER_ROLE = JSON.parse(sessionStorage.USER_ROLE);
  }
  
  let resourcePermission = this.state.resourcePermission;

  resourcePermission.add = (USER_ROLE[4].addPermission === 'Y')? false : true;
  resourcePermission.update = (USER_ROLE[4].modifyPermission === 'Y')? false : true;
  resourcePermission.delete = (USER_ROLE[4].deletePermission === 'Y')? false : true;
  
  this.setState(resourcePermission);

  console.log('#USER_ROLE : ResourceName = '+JSON.stringify(USER_ROLE[4].resourceName))
  console.log('#USER_ROLE : Add = '+JSON.stringify(USER_ROLE[4].addPermission))
  console.log('#USER_ROLE : Update = '+JSON.stringify(USER_ROLE[4].modifyPermission))
  console.log('#USER_ROLE : Delete = '+JSON.stringify(USER_ROLE[4].deletePermission))

}

toggleNewMaterialModel()
{
  this.setState({
     newMaterialModel: ! this.state.newMaterialModel
  });
}

toggleEditMaterialModel()
{
  this.setState({
     editMaterialModel: ! this.state.editMaterialModel
  });
}

getAllMaterial()
{
  let list = [];

  axiosInstance.get('/material/getAll').then((response) => {

    response.data.map(val => {

     list.push({
      materialName: val.materialName,
      quantity: val.quantity,
      rate: val.rate,
       action: [
                 <MDBBtn rounded color="cyan" onClick={this.editMaterial.bind(this, val.materialId,val.materialName,val.quantity,val.rate)} disabled={this.state.resourcePermission.update}> <FaEdit /> </MDBBtn>,
                 <MDBBtn rounded color="danger" onClick={this.toggle(val.materialId)} disabled={this.state.resourcePermission.delete}> <FaTrash /> </MDBBtn>
               ]
     });

    })

    this.setState({material : list})

  });
}

addMaterial()
{
   axiosInstance.post('/material/add', this.state.newMaterialData).then((response) => {
   //console.log(response.data);

    //let {material} = this.state;
    //material.push(response.data);
  this.getAllMaterial();
  NotificationManager.success('Material Added Successfully!', '');

    this.setState({ 
        material: [], 
        newMaterialModel: ! this.state.newMaterialModel, 

        newMaterialData:{

            materialId:'',
            serialNo:'',
            materialName:'',
            quantity:'',
            rate:''
    } 

});

   });

}

editMaterial(materialId, materialName, quantity, rate)
{
     this.setState({
    
        editMaterialModel: ! this.state.editMaterialModel,

        editMaterialData:{

            materialId, materialName, quantity, rate
        },
    
	 });
}

updateMaterial()
{
    axiosInstance.put('/material/update', this.state.editMaterialData).then((response) =>{

        this.getAllMaterial();
        NotificationManager.success('Material Updated Successfully!', '');
        
        this.setState({
    
            editMaterialModel: ! this.state.editMaterialModel,
        });    

    });
}

deleteMaterial(materialId)
{
    axiosInstance.delete('/material/delete/'+materialId).then((response) => {

        this.getAllMaterial();
        NotificationManager.success('Material Deleted Successfully!', '');
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

     axiosInstance.get('/member-details/searchMemberDetails/'+searchValue).then((response) => {

           this.setState({
               memberDetails: response.data
          });
       });
 }

 toggle = nr => () => {
  
  let {newMaterialData} = this.state;
  newMaterialData.materialId = nr;
  this.setState(newMaterialData);

  this.setState({
    modal: !this.state.modal
  });
}

    render(){

      const columns = [
        {
          label: 'Material Name',
          field: 'materialName',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Quantity',
          field: 'quantity',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Rate',
          field: 'rate',
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
  <RctCollapsibleCard heading="All Materials">

     <MDBBtn color="primary" onClick={this.toggleNewMaterialModel.bind(this)} disabled={this.state.resourcePermission.add}> 
      <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} /> 
      Add Material
    </MDBBtn>

      <Modal isOpen={this.state.newMaterialModel} toggle={this.toggleNewMaterialModel.bind(this)}>
        <ModalHeader toggle={this.toggleNewMaterialModel.bind(this)}>Add a material</ModalHeader>
      <ModalBody>
        
<FormGroup>
<div className="form-group">
<Label for="materialName">Material Name</Label>
<Input type="text" name="materialName" id="materialName" 
placeholder="enter material name" 

value={this.state.newMaterialData.material_name} 

onChange={(e) => { 

    let {newMaterialData} = this.state;

    newMaterialData.materialName = e.target.value;

    this.setState({newMaterialData});
 }}

/>
</div>

<div className="form-group">
<Label for="quantity">Quantity</Label>
<Input type="text" name="quantity" id="quantity" placeholder="enter quantity" 

value={this.state.newMaterialData.product_price}

onChange={(e) => {

    let {newMaterialData} = this.state;

    newMaterialData.quantity = e.target.value;

    this.setState({newMaterialData});
}}
/>
</div>

<div className="form-group">
<Label for="rate">Rate</Label>
<Input type="text" name="rate" id="rate" placeholder="enter rate"

value={this.state.newMaterialData.created_on}

onChange={(e) => {

    let {newMaterialData} = this.state;

    newMaterialData.rate = e.target.value;

    this.setState({newMaterialData});
}}
/>
</div>

</FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addMaterial.bind(this)}>Add Material</Button>{' '}
          <Button color="secondary" onClick={this.toggleNewMaterialModel.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

{ /*-------------------------------------------------------------------------------------------------------*/ }
    
<Modal isOpen={this.state.editMaterialModel} toggle={this.toggleEditMaterialModel.bind(this)}>
        <ModalHeader toggle={this.toggleEditMaterialModel.bind(this)}>Edit a material</ModalHeader>
        <ModalBody>
        
<FormGroup>
<div className="form-group">
<Label for="materialName">Material Name</Label>
<Input type="text" name="materialName" id="materialName" 
placeholder="enter material name" 

value={this.state.editMaterialData.materialName} 

onChange={(e) => { 

    let {editMaterialData} = this.state;

    editMaterialData.materialName = e.target.value;

    this.setState({editMaterialData});
 }}
/>
</div>

<div className="form-group">
<Label for="quantity">Quantity</Label>
<Input type="text" name="quantity" id="quantity" placeholder="enter quantity" 

value={this.state.editMaterialData.quantity}

onChange={(e) => {

    let {editMaterialData} = this.state;

    editMaterialData.quantity = e.target.value;

    this.setState({editMaterialData});
}}
/>
</div>

<div className="form-group">
<Label for="rate">Rate</Label>
<Input type="text" name="rate" id="rate" placeholder="enter rate"

value={this.state.editMaterialData.rate}

onChange={(e) => {

    let {editMaterialData} = this.state;

    editMaterialData.rate = e.target.value;

    this.setState({editMaterialData});
}}
/>
</div>

</FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateMaterial.bind(this)}>Update Material</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditMaterialModel.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <DataTable name="UserRole" columns={columns} rows={this.state.material} />

      <NotificationContainer />

      <MDBModal isOpen={this.state.modal} toggle={this.toggle(0)} size="sm" centered>
        <MDBModalBody className="text-center">
         Are sure you want to delete this record?
        </MDBModalBody>
        <MDBModalFooter className="text-center">
          <MDBBtn color="danger" size="sm" onClick={() => this.deleteMaterial(this.state.newMaterialData.materialId)}>Yes</MDBBtn>
          <MDBBtn color="blue-grey" size="sm" onClick={this.toggle(0)}>No</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
  
</RctCollapsibleCard>
     </div>

        )
    }
}

export default Material;