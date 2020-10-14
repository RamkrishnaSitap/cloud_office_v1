import React, { Component } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Pagination from "react-js-pagination";
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Msg from "./Msg";

class ReactDataTable extends Component
{
    constructor(props)
    {
        super(props);
        console.log("#ReactDataTable : "+this.props.tableHeaders)
        console.log("#ReactDataTable DATA : "+this.props.tableBody.length)
        console.log("#MSG : "+this.props.msgU)
        //alert('ReactDataTable : '+this.props.tableBody.length)
    }

    state = {

        tableHeaders:[],

        activePage:1,
        itemsCountPerPage:1,
        totalItemsCount:0,
        pageNumber:1,
        showTotalEntries:10,
    
        searchValue:'',
    }

    render(){

        let msg = "Hello User";

        let tableHeadr = this.props.tableHeaders.map(headName =>  
            <th>{headName}</th>
        )

        return(
        <div className="formelements-wrapper">
        <RctCollapsibleCard heading="All Records">

    <Table className="table table-hover">
       <thead>
           <tr>
              {tableHeadr}
           </tr>
          
       </thead>

<tbody>
    <tr>
       
    </tr>
</tbody>

     </Table>

<h1>Value: { this.props.tableHeaders.map(v => { console.log("VAL : "+v) }) } </h1>

        </RctCollapsibleCard>
        </div>              
             );
         }
}

export default ReactDataTable;

