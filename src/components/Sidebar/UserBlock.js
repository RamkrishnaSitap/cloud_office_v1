/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

// components
import SupportPage from '../Support/Support';


// intl messages
import IntlMessages from 'Util/IntlMessages';
import axiosInstance from '../../util/axiosInstance';

class UserBlock extends Component {

	state = {
		userDropdownMenu: false,
		isSupportModal: false,

		memberProfilePhoto: '',
		userName: '',
		emailId: '',
	}

	componentWillMount(){
		this.getProfilePhoto();
	}

	/**
	 * Logout User
	 */
	logoutUser = () => {
		sessionStorage.clear();
		this.props.history.push("/signup");
	}

	/**
	 * Toggle User Dropdown Menu
	 */
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}

	/**
	 * Open Support Modal
	 */
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}

	/**
	 * On Close Support Page
	 */
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}

	/**
	 * On Submit Support Page
	 */
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
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
			<div className="top-sidebar">
				<div className="sidebar-user-block">
					<Dropdown
						isOpen={this.state.userDropdownMenu}
						toggle={() => this.toggleUserDropdownMenu()}
						className="rct-dropdown"
					>
						<DropdownToggle
							tag="div"
							className="d-flex align-items-center"
						>
							<div className="user-profile">
								<img
									src={(this.state.memberProfilePhoto)?this.state.memberProfilePhoto:require('Assets/avatars/profile.png')}
									alt="user profile"
									className="img-fluid rounded-circle"
									width="50"
									height="100"
								/>
							</div>
							<div className="user-info">
								<span className="user-name ml-4"> {sessionStorage.getItem('memberName')} </span>
								<span className="user-name ml-4"> [{sessionStorage.getItem('USER_ROLE_NAME')}] </span>
								<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
							</div>
						</DropdownToggle>
						<DropdownMenu>
							<ul className="list-unstyled mb-0">
								<li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
									<p className="text-white mb-0 fs-14"> {sessionStorage.getItem('memberName')} </p>
									<span className="text-white fs-14"> {sessionStorage.getItem('memberEmailId')} </span>
								</li>
								<li>
									<Link to={{
										pathname: '/app/users/user-profile-1',
										state: { activeTab: 0 }
									}}>
										<i className="zmdi zmdi-account text-primary mr-3"></i>
										<span><IntlMessages id="widgets.profile" /></span>
									</Link>
								</li>
								<li>
									<Link to={{
										pathname: '/app/users/user-profile-1',
										state: { activeTab: 2 }
									}}>
										<i className="zmdi zmdi-comment-text-alt text-success mr-3"></i>
										<span><IntlMessages id="widgets.messages" /></span>
										<Badge color="danger" className="pull-right">3</Badge>
									</Link>
								</li>
								<li>
									<Link to="/app/pages/feedback">
										<i className="zmdi zmdi-edit text-warning mr-3"></i>
										<span><IntlMessages id="sidebar.feedback" /></span>
										<Badge color="info" className="pull-right">1</Badge>
									</Link>
								</li>
								<li className="border-top">
									<a href="#" onClick={this.logoutUser}>
										<i className="zmdi zmdi-power text-danger mr-3"></i>
										<span><IntlMessages id="widgets.logOut" /></span>
									</a>
								</li>
							</ul>
						</DropdownMenu>
					</Dropdown>
				</div>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
}

export default connect(mapStateToProps, {
	//logoutUserFromFirebase
})(UserBlock);
