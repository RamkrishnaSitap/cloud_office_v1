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

class Vendor extends Component
{

state = {

    vendors: [],
    newVendorDetailsData: {
        vendorId:'',
 
        vendorName:'',
        website:'',
        emailId:'',
        mobileNo:'',
        contactPersonName:''
     },

     resourcePermission: {
      add: false,
      update: false,
      delete: false,
    },

    modal : false,
}

componentWillMount()
{
    this.getAllVendors();
    this.updateResourcePermission();
}

updateResourcePermission(){
  var USER_ROLE = {};

  if (typeof sessionStorage.USER_ROLE !== "undefined") {
    USER_ROLE = JSON.parse(sessionStorage.USER_ROLE);
  }

  
  let resourcePermission = this.state.resourcePermission;

  resourcePermission.add = (USER_ROLE[3].addPermission === 'Y')? false : true;
  resourcePermission.update = (USER_ROLE[3].modifyPermission === 'Y')? false : true;
  resourcePermission.delete = (USER_ROLE[3].deletePermission === 'Y')? false : true;
  
  this.setState(resourcePermission);

  console.log('#USER_ROLE : ResourceName = '+JSON.stringify(USER_ROLE[3].resourceName))
  console.log('#USER_ROLE : Add = '+JSON.stringify(USER_ROLE[3].addPermission))
  console.log('#USER_ROLE : Update = '+JSON.stringify(USER_ROLE[3].modifyPermission))
  console.log('#USER_ROLE : Delete = '+JSON.stringify(USER_ROLE[3].deletePermission))
}

getAllVendors()
{
    let list = [];

    axiosInstance.get('/vendor/getAll').then((response) => {

      response.data.map(val => {

       list.push({
        vendorName: val.vendorName,
        emailId: val.emailId,
        mobileNo: val.mobileNo,
        contactPersonName: val.contactPersonName,
        website: val.website,
         action: [
                   <MDBBtn rounded color="cyan" onClick={this.editVendor.bind(this, val.vendorId)} disabled={this.state.resourcePermission.update}> <FaEdit /> </MDBBtn>,
                   <MDBBtn rounded color="danger" onClick={this.deleteVendor.bind(this, val.vendorId)} disabled={this.state.resourcePermission.delete}> <FaTrash /> </MDBBtn>
                ]
       });

      })

      this.setState({vendors : list})

    });
}

deleteVendor(vendorId)
{
    axiosInstance.delete('/vendor/delete/'+vendorId).then((response) => {

        this.getAllVendors();
    });
    
    this.setState({ modal: !this.state.modal });
}

editVendor(vendorId)
{
    sessionStorage.setItem('vendorId', vendorId);
    this.props.history.push("/app/cloud-office/vendor/add-vendors");
}

onClick = () => this.props.history.push("/app/cloud-office/vendor/add-vendors");

toggle = nr => () => {
  
  let {newVendorDetailsData} = this.state;
  newVendorDetailsData.vendorId = nr;
  this.setState(newVendorDetailsData);

  this.setState({
    modal: !this.state.modal
  });
}

render(){

        const columns = [
            {
              label: 'Vendor Name',
              field: 'vendorName',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Email Id',
              field: 'emailId',
              sort: 'asc',
              width: 270
            },
            {
                label: 'Mobile No.',
                field: 'mobileNo',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Contact PersonName',
                field: 'contactPersonName',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Website',
                field: 'website',
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
  <RctCollapsibleCard heading="All Vendors">

      <MDBBtn color="primary" onClick={this.onClick} disabled={this.state.resourcePermission.add}> 
      <IoIosAddCircle size="25px" style={{verticalAlign:"middle"}} /> 
      Add Vendor
      </MDBBtn>

<DataTable name="Vendor" columns={columns} rows={this.state.vendors} />

<MDBModal isOpen={this.state.modal} toggle={this.toggle(0)} size="sm" centered>
        <MDBModalBody className="text-center">
         Are sure you want to delete this record?
        </MDBModalBody>
        <MDBModalFooter className="text-center">
          <MDBBtn color="danger" size="sm" onClick={() => this.deleteVendor(this.state.newVendorDetailsData.vendorId)}>Yes</MDBBtn>
          <MDBBtn color="blue-grey" size="sm" onClick={this.toggle(0)}>No</MDBBtn>
        </MDBModalFooter>
      </MDBModal>

</RctCollapsibleCard>
     </div>

        )
    }
}

export default Vendor;