import React, {Component} from "react";
import { Spin, Icon } from "antd";
import { connect } from "react-redux";
import DisplayContacts from "./DisplayContacts";
// import * as actions from "../store/actions/auth";
// import * as navActions from "../store/actions/nav";
// import * as messageActions from "../store/actions/message";
// import Contact from "../components/Contact";

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Sidepanel extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            chat_id:this.props.chat_id
        }
    }
 
  render() {
        return (
            <div id="sidepanel">
                <DisplayContacts chat_id={this.state.chat_id}/>
            </div>

        );
    };
}



export default Sidepanel;