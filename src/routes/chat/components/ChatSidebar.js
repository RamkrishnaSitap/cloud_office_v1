/**
 * Chat Sidebar
 */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';

// components
import UserList from './UserList';
import axiosInstance from '../../../util/axiosInstance';

class ChatSidebar extends Component {

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
			<div className="chat-sidebar">
				<div className="user-wrap d-flex justify-content-between">
					<div className="media align-items-center">
						<img
							//src={require('Assets/avatars/user-15.jpg')}
							src={this.state.memberProfilePhoto}
							alt="user-profile"
							className="img-fluid rounded-circle mr-3"
							width="50"
							height="50"
						/>
						<div className="media-body mt-1">
							<h3 className="text-white mb-0">Jhon Doe</h3>
						</div>
						<IconButton className="btn-sm text-white">
							<i className="zmdi zmdi-more-vert text-white"></i>
						</IconButton>
					</div>
				</div>
				<UserList />
			</div>
		);
	}
}

export default ChatSidebar;
