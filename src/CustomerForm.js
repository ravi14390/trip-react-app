import React, { useEffect, useState } from 'react';
import { TextField, Label, DefaultButton,Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
const CustomerForm = ({callback}) => {
    const { instance,accounts  } = useMsal();
    const [cName, setcName] = React.useState("");
    const [cEmail, setcEmail] = React.useState("");
    const[dataLoaded,setLoaded] = useState(false);
    const[customerExist,setcustomerExist] = useState(false);
    const[notAuthorised,setnotAuthorised] = useState(false);
    useEffect(()=>{
        setLoaded(true);
    },[]);
    const onChangeName = (event) => {
        setcName(event.target.value);
      };
    const onChangeEmail = (event) => {
        setcEmail(event.target.value);
      };
    
    const saveTrip = () => {
        setLoaded(false);
        let _data = {
            Name:cName,
            Email:cEmail,
            LoginId:cEmail
            
        }
        console.log("post data:",_data);
        let _accessToken = "";
        const request = {
            ...loginRequest,
            account: accounts[0]
        };
        instance.acquireTokenSilent(request).then(response => {
                if (response.accessToken) {
                    _accessToken = response.accessToken;
                    const config = {
                        headers: { Authorization: `Bearer ${_accessToken}` }
                    };
                    axios.post("https://trip-api20220519105937.azurewebsites.net//api/customer/add",_data,config).then((res)=>{
                        console.log(res);
                        if(res.status == 409){
                            setcustomerExist(true);
                        }
                        callback()
                    },(err)=>{
                        console.log("error:",err);
                        if(err.response.status == 409){
                            setcustomerExist(true);
                        }
                        else if(err.response.status == 403){
                            setnotAuthorised(true);
                        }
                        setLoaded(true);
                    });
                }
            }).catch(error =>{setLoaded(true); alert('token error. Please login again')});

        
    }
    return(
        
        <>
        {
            customerExist
            ?
                <MessageBar messageBarType={MessageBarType.error}>Customer already exist.</MessageBar>
            :
            <></>
        }
        {
            notAuthorised
            ?
                <MessageBar messageBarType={MessageBarType.error}>You are not authorized to perform this action.</MessageBar>
            :
            <></>
        }
        {
            dataLoaded
            ?
                <>
                     <h4>New Customer</h4>
                    <div>
                        <Label>Name</Label>
                        <input type={"text"} value={cName} onChange={onChangeName}></input>
                        <Label>Email</Label>
                        <input type={"text"} value={cEmail} onChange={onChangeEmail}></input>
                        <Label>Login ID</Label>
                        <input type={"text"} value={cEmail} disabled={true}></input>
                        <div>
                            <DefaultButton style={{marginTop:"20px"}} disabled={(cName && cEmail)?false:true} onClick={saveTrip}>Create Customer</DefaultButton>
                        </div>
                    </div>
                </>
            :<>
                <Spinner size={SpinnerSize.large} label="Working on it..." />
            </>
        }
          
        </>
    );
}
export default CustomerForm;