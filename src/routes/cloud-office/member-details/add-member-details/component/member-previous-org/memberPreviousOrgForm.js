import React from "react"
import axios from 'axios';
import MemberPreviousOrgList from "./memberPreviousOrgList";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { Tooltip, Zoom } from "@material-ui/core";
import { IoIosAddCircle } from "react-icons/io";
import { MDBBtn, MDBTooltip } from "mdbreact";
import axiosInstance from "../../../../../../util/axiosInstance";
import { NotificationManager, NotificationContainer } from "react-notifications";

class MemberPreviousOrgForm extends React.Component {

    state = {
        memberPreviousOrgList: [{ index: Math.random(), companyNames: "", startDate: "", endDate: "", description: "", ctc: "" }],
        date: "",
        description: "",

        name: 'Cat in the Hat',
        age: '',
        multiline: 'Controlled',
        currency: 'EUR',
  
          genderRadio1: 'male',
          genderRadio2: 'male',
          genderRadio3: 'male'
    }

    componentWillMount()
    {
        this.getMemberEmploymentList();
        //alert('OrgForm : '+this.state.memberPreviousOrgList.length);
    }

    handleChangeRadio = (e, key) => {
		this.setState({ [key]: e.target.value });
	}

    handleChange = (e) => {
        if (["companyNames", "startDate", "endDate", "description", "ctc"].includes(e.target.name)) {
            let memberPreviousOrgList = [...this.state.memberPreviousOrgList]
            memberPreviousOrgList[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    
    addNewRow = (e) => {
        //alert('addNewRow()')
        this.setState((prevState) => ({
            memberPreviousOrgList: [...prevState.memberPreviousOrgList, { index: Math.random(), companyNames: "", startDate: "", endDate: "", description: "", ctc: "" }],
        }));

        window.member_previous_orgList.addPN();
    }

    getMemberEmploymentList()
    {
        axiosInstance.get('/member-details/getMemberEmploymentDetailsList/byMemberId/'+sessionStorage.getItem('USER_EDIT_ID')).then((response) => {
    
        let index, companyNames, startDate, endDate, description, ctc;
//alert('OrgForm : '+response.data)
       // let memberPreviousOrgList = [...prevState.memberPreviousOrgList, { index: Math.random(), companyNames: "", startDate: "", endDate: "", description: "", ctc: "" }];
     
        response.data.map((val, index) => {
    
           index = Math.random();
           companyNames = val.companyNames;
           startDate = val.startDate;
           endDate = val.endDate;
           description = val.description;
           ctc = val.ctc;

           this.setState((prevState) => ({
            memberPreviousOrgList: [...prevState.memberPreviousOrgList, { index, companyNames, startDate, endDate, description, ctc }],
        }));

        });

        });
    }

    deteteRow = (index) => {
        this.setState({
            memberPreviousOrgList: this.state.memberPreviousOrgList.filter((s, sindex) => index !== sindex),
        });
        // const taskList1 = [...this.state.memberPreviousOrgList];
        // taskList1.splice(index, 1);
        // this.setState({ memberPreviousOrgList: taskList1 });
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.date==='' || this.state.description==='')
        {
            NotificationManager.warning("Please Fill up Required Field . Please check Task and Date Field");
            return false;
        }
        for(var i=0;i<this.state.memberPreviousOrgList.length;i++)
        {
                if(this.state.memberPreviousOrgList[i].companyNames==='' || this.state.memberPreviousOrgList[i].startDate==='')
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
            memberPreviousOrgList: this.state.memberPreviousOrgList.filter(r => r !== record)
        });
    }

    onClick()
    {
        alert('onClick')
    }

    render() {
        let { memberPreviousOrgList } = this.state//let { notes, date, description, memberPreviousOrgList } = this.state
        
        return (
            <div className="formelements-wrapper">
                <NotificationContainer/>

                <form onSubmit={this.handleSubmit} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 5 }}>
                       
                    <div className="col-sm-12 col-md-12 col-xl-12">
                           
                    <RctCollapsibleCard heading="Previous Employment Details" customClasses="border border-info">
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
                                                <th className="required" >Company Name</th>
                                                <th className="required" >Start Date</th>
                                                <th className="required" >End Date</th>
                                                <th className="required" >Description</th>
                                                <th className="required" >CTC</th>
                                                <th className="required">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <MemberPreviousOrgList add={this.addNewRow} delete={this.clickOnDelete.bind(this)} memberPreviousOrgList={memberPreviousOrgList} />
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
export default MemberPreviousOrgForm