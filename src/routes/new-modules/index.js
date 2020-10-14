import React,{ Component } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class ViewAllRecords extends Component
{

state = {
    members: [],
    newMemberData: {
        firstName:'',
        middleName:'',
        lastName:'',
        contactNumber:'',
        emailId:'',
        address:'',
        joinDate:''
    },

    editMemberData: {
        id:'',
        firstName:'',
        middleName:'',
        lastName:'',
        contactNumber:'',
        emailId:'',
        address:'',
        joinDate:''
    },
    newMemberModel: false,
    editMemberModel: false
}

componentWillMount()
{
    this.getAllMembers();
}


toggleNewMemberModel()
{
  this.setState({
     newMemberModel: ! this.state.newMemberModel
  });
}

toggleEditMemberModel()
{
  this.setState({
     editMemberModel: ! this.state.editMemberModel
  });
}

getAllMembers()
{
    axios.get('http://localhost:8080/mymess/getAllMembers').then((response) => {

        this.setState({
            members: response.data
        })
    });
}

addMember()
{
   axios.post('http://localhost:8080/mymess/addMember', this.state.newMemberData).then((response) => {
   //console.log(response.data);

    let {members} = this.state;

    members.push(response.data);

    this.setState({ 
        members, 
        newMemberModel: false, 

        newMemberData:{
        firstName:'',
        middleName:'',
        lastName:'',
        contactNumber:'',
        emailId:'',
        address:'',
        joinDate:''
    } 

});

   });

}

editMember(id, firstName, middleName, lastName, contactNumber, emailId, address, joinDate)
{
    // console.log(id, firstName, middleName, lastName, contactNumber, emailId, address, joinDate)

     this.setState({
    
        editMemberModel: ! this.state.editMemberModel,

        editMemberData:{

          id, firstName, middleName, lastName, contactNumber, emailId, address, joinDate
        },
    
	 });
	 

}


updateMember()
{
    axios.put('http://localhost:8080/mymess/updateMember', this.state.editMemberData).then((response) =>{

        this.getAllMembers();
    });
}

deleteMember(id)
{
    axios.delete('http://localhost:8080/mymess/deleteMember/'+id).then((response) => {

        this.getAllMembers();

    });
}


    render(){

let members = this.state.members.map((member) => {
    return(

        <tr key={member.id}>
        <td>{member.id}</td>
        <td>{member.firstName}</td>

        <td>{member.middleName}</td>
        <td>{member.lastName}</td>
        <td>{member.contactNumber}</td>
        <td>{member.emailId}</td>
        <td>{member.address}</td>
        <td>{member.joinDate}</td>
        <td>
             <Button className="btn btn-success btn-sm mr-2" 
             onClick={
                 this.editMember.bind(this, 
                 member.id, member.firstName, member.middleName, member.lastName, member.contactNumber, 
                 member.emailId, member.address, member.joinDate
                 )}>Edit</Button>
             <Button className="btn btn-danger btn-sm" onClick={this.deleteMember.bind(this, member.id)}>Delete</Button>
        </td>
      </tr>   

    )
})

        return(

<div className="container">

      <Button color="primary" onClick={this.toggleNewMemberModel.bind(this)}>Add Member</Button>
      <Modal isOpen={this.state.newMemberModel} toggle={this.toggleNewMemberModel.bind(this)}>
        <ModalHeader toggle={this.toggleNewMemberModel.bind(this)}>Add a new member</ModalHeader>
      <ModalBody>
        
<FormGroup>
<Label for="firstName">First Name</Label>
<Input type="text" name="firstName" id="firstName" 
placeholder="enter member first name" 

value={this.state.newMemberData.firstName} 

onChange={(e) => { 

    let {newMemberData} = this.state;

    newMemberData.firstName = e.target.value;

    this.setState({newMemberData});
 }}

/>

<Label for="middleName">Middle Name</Label>
<Input type="text" name="middleName" id="middleName" placeholder="enter member middle name" 

value={this.state.newMemberData.middleName}

onChange={(e) => {

    let {newMemberData} = this.state;

    newMemberData.middleName = e.target.value;

    this.setState({newMemberData});
}}

/>

<Label for="lastName">Last Name</Label>
<Input type="text" name="lastName" id="lastName" placeholder="enter member last name"

value={this.state.newMemberData.lastName}

onChange={(e) => {

    let {newMemberData} = this.state;

    newMemberData.lastName = e.target.value;

    this.setState({newMemberData});
}}

/>

<Label for="contactNumber">Contact Number</Label>
<Input type="text" name="contactNumber" id="contactNumber" placeholder="enter member contact number"

value={this.state.newMemberData.contactNumber}

onChange={(e) => {

    let {newMemberData} = this.state;

    newMemberData.contactNumber = e.target.value;

    this.setState({newMemberData});
}}

/>

<Label for="emailId">Email Id</Label>
<Input type="text" name="emailId" id="emailId" placeholder="enter member email id"

value={this.state.newMemberData.emailId}

onChange={(e) => {

    let {newMemberData} = this.state;

    newMemberData.emailId = e.target.value;

    this.setState({newMemberData});
}}

/>

<Label for="address">Address</Label>
<Input type="text" name="address" id="address" placeholder="enter member address" 

value={this.state.newMemberData.address}

onChange={(e) => {

    let {newMemberData} = this.state;

    newMemberData.address = e.target.value;

    this.setState({newMemberData});
}}

/>

<Label for="joinDate">Join Date</Label>
<Input type="date" name="joinDate" id="joinDate" 

value={this.state.newMemberData.joinDate}

onChange={(e) => {

    let {newMemberData} = this.state;

    newMemberData.joinDate = e.target.value;

    this.setState({newMemberData});
}}

/>
</FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addMember.bind(this)}>Add Member</Button>{' '}
          <Button color="secondary" onClick={this.toggleNewMemberModel.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

    
<Modal isOpen={this.state.editMemberModel} toggle={this.toggleEditMemberModel.bind(this)}>
        <ModalHeader toggle={this.toggleEditMemberModel.bind(this)}>Edit a member</ModalHeader>
        <ModalBody>
        
<FormGroup>
<Label for="firstName">First Name</Label>
<Input type="text" name="firstName" id="firstName" 
placeholder="enter member first name" 

value={this.state.editMemberData.firstName} 

onChange={(e) => { 

    let {editMemberData} = this.state;

    editMemberData.firstName = e.target.value;

    this.setState({editMemberData});
 }}

/>

<Label for="middleName">Middle Name</Label>
<Input type="text" name="middleName" id="middleName" placeholder="enter member middle name" 

value={this.state.editMemberData.middleName}

onChange={(e) => {

    let {editMemberData} = this.state;

    editMemberData.middleName = e.target.value;

    this.setState({editMemberData});
}}

/>

<Label for="lastName">Last Name</Label>
<Input type="text" name="lastName" id="lastName" placeholder="enter member last name"

value={this.state.editMemberData.lastName}

onChange={(e) => {

    let {editMemberData} = this.state;

    editMemberData.lastName = e.target.value;

    this.setState({editMemberData});
}}

/>

<Label for="contactNumber">Contact Number</Label>
<Input type="text" name="contactNumber" id="contactNumber" placeholder="enter member contact number"

value={this.state.editMemberData.contactNumber}

onChange={(e) => {

    let {editMemberData} = this.state;

    editMemberData.contactNumber = e.target.value;

    this.setState({editMemberData});
}}

/>

<Label for="emailId">Email Id</Label>
<Input type="text" name="emailId" id="emailId" placeholder="enter member email id"

value={this.state.editMemberData.emailId}

onChange={(e) => {

    let {editMemberData} = this.state;

    editMemberData.emailId = e.target.value;

    this.setState({editMemberData});
}}

/>

<Label for="address">Address</Label>
<Input type="text" name="address" id="address" placeholder="enter member address" 

value={this.state.editMemberData.address}

onChange={(e) => {

    let {editMemberData} = this.state;

    editMemberData.address = e.target.value;

    this.setState({editMemberData});
}}

/>

<Label for="joinDate">Join Date</Label>
<Input type="date" name="joinDate" id="joinDate" 

value={this.state.editMemberData.joinDate}

onChange={(e) => {

    let {editMemberData} = this.state;

    editMemberData.joinDate = e.target.value;

    this.setState({editMemberData});
}}

/>
</FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateMember.bind(this)}>Update Member</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditMemberModel.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>





<div className="row mt-3">
<div className="col-md-12">
<div className="col-md-12">

<Table className="table table-hover" >
       <thead>
         <tr>
           <th>Id</th>
           <th>First Name</th>
           <th>Middle Name</th>
           <th>Last Name</th>
           <th>Contact Number</th>
           <th>Email Id</th>
           <th>Address</th>
           <th>Join Date</th>
           <th>Action</th>
         </tr>
       </thead>

<tbody>
 {members}
</tbody>

     </Table>

</div>

         </div>
       </div>

     </div>

        )
    }
}

export default ViewAllRecords;