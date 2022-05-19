import React, { useEffect, useState } from 'react';
import { TextField, Label, DefaultButton,Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
const NewTrip = ({callback}) => {
    const { instance,accounts  } = useMsal();
    const [selectedFromKey, setselectedFromKey] = React.useState(undefined);
    const [selectedToKey, setselectedToKey] = React.useState(undefined);
    const [ddlFromOptions,setddlFromOptions] = useState([]);
    const[dataLoaded,setLoaded] = useState(false);
    const [ddlToOptions,setddlToOptions] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [customerNotFound,setcustomerNotFound] = useState(false);
    useEffect(()=>{
        axios.get("https://restcountries.com/v2/all?fields=name").then((data)=>{
            let _from = [];
            let _to = [];
            data.data.forEach(element => {
                _from.push({"key":element["name"],"text":element["name"]});
                _to.push({"key":element["name"],"text":element["name"]});
            });
            setddlFromOptions(_from);
            setddlToOptions(_to);
            setLoaded(true);
        },(err)=>{

        });
    },[]);
    const onChangeFromC = (event) => {
        setselectedFromKey(event.target.value);
      };
    const onChangeToC = (event) => {
        setselectedToKey(event.target.value);
      };
    
    const saveTrip = () => {
        setLoaded(false);
        let _data = {
            FromCountry:selectedFromKey,
            ToCountry:selectedToKey,
            StartDate:startDate,
            EndDate:endDate
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
                    axios.post("https://trip-api20220519105937.azurewebsites.net//api/trip/add",_data,config).then((res)=>{
                        console.log(res);
                        if(res.status == 404){
                            setcustomerNotFound(true);
                            setLoaded(true);
                        }
                        else{
                            callback();
                        }
                    },(err)=>{
                        console.log("error:",err);
                        if(err.response.status == 404){
                            setcustomerNotFound(true);
                        }
                        setLoaded(true);
                    });
                }
            }).catch(error =>{setLoaded(true); alert('token error. Please login again')});

        
    }
    return(
        
        <>
        {
            customerNotFound
            ?
                <MessageBar messageBarType={MessageBarType.error}>Customer entry is not available in database. Please ask admin to create your customer entry.</MessageBar>
            :
            <></>
        }
        {
            dataLoaded
            ?
                <>
                     <h4>New Trip</h4>
            <div>
                
                <Label>From Country</Label>
            <select onChange={onChangeFromC}>
                <option value={""}>Select Country</option>
                {
                    
                    ddlFromOptions.map((opt,index)=>{
                        return <option key={index} value={opt["key"]}>{opt["text"]}</option>
                    })
                }
            </select>
            <Label>To Country</Label>
            <select onChange={onChangeToC}>
            <option value={""}>Select Country</option>
                {
                    ddlToOptions.map((opt,index)=>{
                        return <option key={index} value={opt["key"]}>{opt["text"]}</option>
                    })
                }
            </select>
            
            <Label>Start Date</Label>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <Label>End Date</Label>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            <br/>
            <DefaultButton style={{marginTop:"20px"}} disabled={(selectedFromKey && selectedToKey && startDate && endDate)?false:true} onClick={saveTrip}>Create Trip</DefaultButton>
            </div>
                </>
            :<>
                <Spinner size={SpinnerSize.large} label="Working on it..." />
            </>
        }
          
        </>
    );
}
export default NewTrip;