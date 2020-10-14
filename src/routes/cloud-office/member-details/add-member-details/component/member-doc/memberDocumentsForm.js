import React from "react"
import axios from 'axios';
import MemberDocumentsList from "./memberDocumentsList";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { MDBTooltip, MDBBtn } from "mdbreact";
import { IoIosAddCircle } from "react-icons/io";
import { Zoom } from "@material-ui/core";
import axiosInstance from "../../../../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

class MemberDocumentsForm extends React.Component {
    state = {
        memberDocumentsList: [{ index: Math.random(), memberDocumentsId: "", documentType: "", docOriginalNmae: "" }],
        date: "",
        description: "",
    }

    componentWillMount()
    {
      this.getAllMemberDocList();
    }

    getAllMemberDocList(){

        axiosInstance.get('/member-details/getAllDocumentListByMemberDetailsId/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
          //alert(response.data.length)
        response.data.map((val, index) => {
            this.setState((prevState) => ({
                memberDocumentsList: [...prevState.memberDocumentsList, { index: Math.random(), memberDocumentsId: val.memberDocumentsId, documentType: val.documentType, docOriginalName: val.docOriginalName}],
            }));

        });

        });
    }

    handleChange = (e) => {
        if (["projectName", "task", "taskNotes", "taskStatus"].includes(e.target.name)) {
            let memberDocumentsList = [...this.state.memberDocumentsList]
            memberDocumentsList[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    addNewRow = (e) => {
        window.member_documents_list.addNewRow(e);
    }
    
    deteteRow = (index) => {
        this.setState({
            memberDocumentsList: this.state.memberDocumentsList.filter((s, sindex) => index !== sindex),
        });
        // const taskList1 = [...this.state.memberDocumentsList];
        // taskList1.splice(index, 1);
        // this.setState({ memberDocumentsList: taskList1 });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.date==='' || this.state.description==='')
        {
            NotificationManager.warning("Please Fill up Required Field . Please check Task and Date Field");
            return false;
        }
        for(var i=0;i<this.state.memberDocumentsList.length;i++)
        {
                if(this.state.memberDocumentsList[i].projectName==='' || this.state.memberDocumentsList[i].task==='')
                {
                    NotificationManager.warning("Please Fill up Required Field.Please Check Project name And Task Field");
                    return false;
                }
        }
        let data = { formData: this.state, userData: localStorage.getItem('user') }
        axios.defaults.headers.common["Authorization"] = localStorage.getItem('token');
        axios.post("http://localhost:9000/api/task", data).then(res => {
            if(res.data.success) NotificationManager.success(res.data.msg);
        }).catch(error => {
            if(error.response.status && error.response.status===400)
            NotificationManager.error("Bad Request");
            else NotificationManager.error("Something Went Wrong");
            this.setState({ errors: error })
        });
    }

    clickOnDelete(record) {
        this.setState({
            memberDocumentsList: this.state.memberDocumentsList.filter(r => r !== record)
        });
    }

    render() {
        let { memberDocumentsList } = this.state//let { notes, date, description, memberDocumentsList } = this.state
        return (
            <div className="formelements-wrapper">
                <NotificationContainer/>
           
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                       
                    <div className="col-sm-12 col-md-12 col-xl-12">
                          
                    <RctCollapsibleCard heading="Member Document Attachments" customClasses="border border-info">

                    <div className="row">
   <div className="col-sm-11 col-md-11 col-xl-11"></div>

   <div className="col-sm-1 col-md-1 col-xl-1">
   <MDBTooltip sm placement="top" TransitionComponent={Zoom}>  
     <MDBBtn color="primary" onClick={this.addNewRow}> 
        <IoIosAddCircle size="20px" style={{verticalAlign:"middle"}} /> 
     </MDBBtn>
     <div>Add new row</div>
    </MDBTooltip>  
   </div>
</div>
                               <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="required">Document Type</th>
                                                <th className="required">Attached Documents</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <MemberDocumentsList add={this.addNewRow} delete={this.clickOnDelete.bind(this)} getAllMemberDocList={this.getAllMemberDocList} memberDocumentsList={memberDocumentsList} />
                                        </tbody>
                                    </table>

                    </RctCollapsibleCard>

                        </div>
                       
                    </div>
                </form>
               
            </div>
        )
    }
}
export default MemberDocumentsForm