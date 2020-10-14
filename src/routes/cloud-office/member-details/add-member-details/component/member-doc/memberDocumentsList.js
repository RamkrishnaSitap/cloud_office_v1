import React, { Component } from "react";
import axios from 'axios';
import { IoIosAddCircle, IoIosRemoveCircle } from 'react-icons/io';
import { MDBBtn, MDBTooltip } from "mdbreact";
import { Tooltip, Zoom } from "@material-ui/core";
import { CustomInput, Input } from 'reactstrap';
import { FaDownload } from "react-icons/fa";
import axiosInstance from "../../../../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

export default class MemberDocumentsList extends Component{

constructor()
{
   super();

   window.member_documents_list = this;
}

state = {

    memberDocumentsList: [{ index: Math.random(), memberDocumentsId: "", documentType: "", docOriginalName: "" }],
  
  //--------------------------

  documentType: '',
  memberDocList: [],

  temp_documentType: [],
  temp_attachedDocument: [],
  temp_notes: [],
  temp_status: [],

  newMemberDetailsData: {

     documentId: '',
     memberDetailsId:'',

     documentType: [],
     attachedDocuments: [],
     notes: [],
     status: []
  }
};

componentWillMount()
{
    this.getAllMemberDetails();
    this.getAllMemberDocList();

    //this.addPN();
    //this.props.add();

    this.clickOnDelete(this.state.memberDocumentsList[0]);
    //alert('OrgList : '+this.props.memberDocumentsList.length);
    this.addNewRow.bind(this)
}

addNewMemberDetails()
{
 // this.props.add();
 // this.addPN();
if(!!!(this.state.temp_documentType)===true || this.state.temp_documentType.length === 1)
{
  //alert('is null')
  this.getMemberEmploymentList();
}

console.log('#addNewMemberDetails() :- '+this.state.temp_documentType)
console.log(!!!(this.state.temp_documentType))

  let {newMemberDetailsData} = this.state;
  newMemberDetailsData.documentType = this.state.temp_documentType.join('').split('');
  newMemberDetailsData.attachedDocuments = this.state.temp_attachedDocument.join('').split('');
  newMemberDetailsData.notes = this.state.temp_notes;
  newMemberDetailsData.status = this.state.temp_status;

  this.setState({newMemberDetailsData});

    axiosInstance.post('/member-details/add/', this.state.newMemberDetailsData).then((response) => {
      //console.log(response.data);
      NotificationManager.success('Documents Addedd Successfully!', '');
   });
}

getAllMemberDetails()
    {
        axiosInstance.get('/member-details/getById/'+sessionStorage.getItem('MEMBER_ID')).then((response) => {
    
            this.setState({
             newMemberDetailsData: response.data
            })
        });
    }

    getMemberEmploymentList()
    {
        axiosInstance.get('/member-details/getMemberEmploymentDetailsList/byMemberId/'+sessionStorage.getItem('MEMBER_ID')).then((response) => {
    
        let index, documentType, task, taskNotes, taskStatus;
//alert('OrgList : '+response.data);
       // let memberDocumentsList = [...prevState.memberDocumentsList, { index: Math.random(), documentType: "", task: "", taskNotes: "", taskStatus: "" }];
     
      response.data.map((val, idx) => {

        //console.log(val.documentType !== undefined+" : "+idx+" is null")
console.log(val.documentType !== undefined)
        if('getMemberEmploymentList() : '+val.documentType !== undefined)
        {
          this.setState({
            temp_documentType: this.state.temp_documentType.concat(val.documentType),
            temp_attachedDocument: this.state.temp_attachedDocument.concat(val.attachedDocuments),
            temp_notes: this.state.temp_notes.concat(val.notes),
            temp_status: this.state.temp_status.concat(val.status)
          });
        }

      });

      //this.props.add();
     console.log(this.state.temp_documentType.length)
     
        });
    }

    onFileChangeHandler = (e) => {
      e.preventDefault();
    // alert(e.target.attributes.getNamedItem('documentId').value)
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('documentType', this.state.documentType);
      formData.append('memberDetailsId', sessionStorage.getItem('USER_EDIT_ID'));
    
      axiosInstance.post('/member-details/uploadMemberDocFile/', formData).then(response => {
      
         this.setState({memberDocumentsList: []});
         response.data.map((val, index) => {
          this.setState((prevState) => ({
              memberDocumentsList: [...prevState.memberDocumentsList, { index: Math.random(), memberDocumentsId: val.memberDocumentsId, documentType: val.documentType, docOriginalName: val.docOriginalName}],
          }));

          NotificationManager.success('Document Uploaded Successfully!', '');
  
      });

      });
  };

  addNewRow = (e) => {
    this.setState((prevState) => ({
        memberDocumentsList: [...prevState.memberDocumentsList, { index: Math.random(), memberDocumentsId: "", documentType: "", docOriginalName: ""}],
    }));
}

  getAllMemberDocList(){
//alert('getAllMemberDocList()')
    axiosInstance.get('/member-details/getAllDocumentListByMemberDetailsId/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
     
    response.data.map((val, index) => {
        this.setState((prevState) => ({
            memberDocumentsList: [...prevState.memberDocumentsList, { index: Math.random(), memberDocumentsId: val.memberDocumentsId, documentType: val.documentType, docOriginalName: val.docOriginalName}],
        }));

    });

    });
}

  downloadFile = (memberDocumentsId, docOriginalName) =>{
      //alert(memberDocumentsId)
    axiosInstance({
      url: '/member-details/downloadFile/'+memberDocumentsId+'/'+sessionStorage.getItem('MEMBER_ID'),
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      
 //console.log('response.headers["content-disposition"].split("filename=")[1] : '+response.headers.get("Content-Disposition").split("filename=")[1])

     docOriginalName = docOriginalName.split('.');
    
     const fileType = response.data.type.split('/');
     const fileExtension = (fileType[1]==='octet-stream')? 'docx' : fileType[1];
     //alert(fileType[0]+" : "+fileType[1])
     const fileName = docOriginalName[0]+'.'+fileExtension;

  const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); //or any other extension
  document.body.appendChild(link);
  link.click();
    
    });
    
  }

  clickOnDelete(record) {
    this.setState({
        memberDocumentsList: this.state.memberDocumentsList.filter(r => r !== record)
    });
}

  deleteFile = (val) =>{
    //alert(val.memberDocumentsId)
  axiosInstance.get('/member-details/deleteFile/'+val.memberDocumentsId+'/'+sessionStorage.getItem('MEMBER_ID')).then((response) => {
     NotificationManager.success('Document Deleted Successfully!', '');
  });
  
  //this.props.getAllMemberDocList();
  this.clickOnDelete(val);
}

  render(){
    
    let valData = "MyData";
    //alert('memberDocumentsList : '+this.state.memberDocumentsList.length)

  return (
  this.state.memberDocumentsList.map((val, idx) => {
//alert('#memberDocumentsId : '+val.memberDocumentsId)
      let documentType = `documentType-${idx}`, docOriginalName = `docOriginalName-${idx}`
      
      return (
      
        <tr key={val.index}>
      
          <td>
          <div className="form-group">
            <Input type="select" name="documentType" data-id={idx} className="form-control" 
             value={(val.documentType==='')? this.state.documentType : val.documentType} 
             onChange={(e) => {
               let documentType = this.state;
               documentType = e.target.value

               this.setState({documentType});
             }}
            >
              <option value="select">-select-</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In progress</option>
              <option value="Completed">Completed</option>
              <option value="Hold">Hold</option>
            </Input>
            </div>
          </td>

          <td>
          <div className="form-group">
            <CustomInput type="file" id="docOriginalName" label={val.docOriginalName} documentId={val.memberDocumentsId} onChange={this.onFileChangeHandler} />
          </div>
          </td>

          <td>
            {
              <div className="form-group">
               <MDBTooltip sm placement="top" TransitionComponent={Zoom}>
               <MDBBtn color="info" onClick={this.downloadFile.bind(this, val.memberDocumentsId, val.docOriginalName)}>
                  <FaDownload size="15px" style={{verticalAlign:"middle"}} />
               </MDBBtn>
                <div>Download</div>
              </MDBTooltip> 

              <MDBTooltip sm placement="top" TransitionComponent={Zoom}>
              <MDBBtn color="danger" onClick={this.deleteFile.bind(this, val)}>
                  <IoIosRemoveCircle size="15px" style={{verticalAlign:"middle"}} />
               </MDBBtn> 
               <div>Remove this document</div>
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
