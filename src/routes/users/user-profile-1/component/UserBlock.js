/**
 * User Block
 */
import React, { Component } from 'react';
import axiosInstance from '../../../../util/axiosInstance';

class UserBlock extends Component {

    state = {
        memberProfilePhoto: '',
    }

    componentWillMount(){
        this.getProfilePhoto();
    }

    getProfilePhoto = () =>{
		//alert(memberDocumentsId)
		axiosInstance({
		url: '/member-details/getProfilePhoto/'+sessionStorage.getItem('MEMBER_ID'),
		method: 'GET',
		responseType: 'blob'
	  }).then((response) => {
	 
	 const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
	 
	 this.setState({memberProfilePhoto: url});
		
	  });
	  
	 }

    render() {
        return (
            <div className="profile-top mb-20">
                <img src={require('Assets/img/profile-bg.jpg')} alt="profile banner" className="img-fluid" width="1920" height="345" />
                <div className="profile-content">
                    <div className="media">
                        <img 
                        src={this.state.memberProfilePhoto}
                        //src={require('Assets/avatars/user-15.jpg')} 
                        alt="user profile" className="rounded-circle mr-30 bordered" width="140" height="140" />
                        <div className="media-body pt-25">
                            <div className="mb-20">
                                <h2>{sessionStorage.getItem('memberName')}</h2>
                                <p>{sessionStorage.getItem('memberEmailId')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserBlock;
