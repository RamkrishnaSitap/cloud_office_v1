import React,{ Component } from "react";
import axios from 'axios';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import HozAlternative from './component/HozAlternative.js';


class AddMemberDetails extends Component
{
    render(){
      
        return(
  
          <div className="stepper-wrapper">
            {/*<PageTitleBar title={<IntlMessages id="sidebar.stepper" />} match={this.props.match} /> */}
               <RctCollapsibleCard heading="Vendor Details">
               <HozAlternative />
               </RctCollapsibleCard>
        </div>
         
        );

    };

}

export default AddMemberDetails;