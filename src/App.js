import React,{useState} from 'react';
import './App.css';
import axios from 'axios';
import Trips from './Trips';
import { Spinner, SpinnerSize, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useIsAuthenticated } from "@azure/msal-react";
import NewTrip from './NewTrip';
import CustomerForm from './CustomerForm';
function handleLogin(instance) {
  instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
  });
}
function handleLogout(instance) {
  instance.logoutPopup().catch(e => {
      console.error(e);
  });
}
function App() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loading,setLoading] = useState(false);
  const [notAuthorised,setnotAuthorised] = useState(false);
  const [tripData,setTripData] = useState([]);
  const [isError,setIsError] = useState(false);
  const [showLoginMessage,setShowLoginMessage] = useState(false);
  const [newForm,setNewForm] = useState(false);
  const [newCustForm,setCustNewForm] = useState(false);
  const getAllTrips = () => {
    setLoading(true);
    setIsError(false);
    setnotAuthorised(false);
    setNewForm(false);
    setCustNewForm(false);
    axios.get("https://trip-api20220519105937.azurewebsites.net/api/trip").then((data)=>{
      if(data.status == 200){
        setTripData(data.data);
        setLoading(false);
      }
      else{
        setIsError(true);
        setLoading(false);
      }
    },(err)=>{
      if(err.response.status == 401){
        setnotAuthorised(true);
        setLoading(false);
      }
    });
  }
  const newTrip = () => {
    setTripData([]);
    setCustNewForm(false);
      setNewForm(true);
   
  }
  const newCustomer = () => {
    setTripData([]);
    setNewForm(false);
    setCustNewForm(true);
   
  }
  return (
    <div style={{width:"70%",margin:"25px auto"}} className="App">
      <div>
        <PrimaryButton onClick={getAllTrips} style={{marginRight:"20px"}} iconProps={{iconName:"Airplane"}}>Get All Trips</PrimaryButton>
        <PrimaryButton onClick={newTrip} style={{marginRight:"20px"}} iconProps={{iconName:"Add"}}>Create New Trip</PrimaryButton>
        <PrimaryButton onClick={newCustomer} style={{marginRight:"20px"}} iconProps={{iconName:"Add"}}>Create New Customer</PrimaryButton>
        {
          
          <PrimaryButton disabled={isAuthenticated} onClick={() => {setShowLoginMessage(false);handleLogin(instance)}} style={{marginRight:"20px"}} iconProps={{iconName:"UserFollowed"}}>Login</PrimaryButton>
          
        }
        <PrimaryButton disabled={!isAuthenticated} onClick={() => {handleLogout(instance);setShowLoginMessage(true);}} iconProps={{iconName:"UserRemove"}}>Logout</PrimaryButton>
      </div>
      <div style={{marginTop:"25px"}}>
        {
          loading
          ?
            <div>
              <Spinner size={SpinnerSize.large} label="Working on it..." />
            </div>
          :
          tripData.length>0?
          <>
            <Trips tripsData={tripData}></Trips>
          </>:<></>
        }
        {
          notAuthorised
          ?
            <MessageBar messageBarType={MessageBarType.blocked}>You Are Not Authorised To Access This Resource.</MessageBar>
          :
          <></>
        }
        {
          (newForm || newCustForm) && !isAuthenticated
          ?
          <MessageBar messageBarType={MessageBarType.error}>You are not logged in. Please login.</MessageBar>
          :
          <></>
        }
        {
          newForm && isAuthenticated
          ?
          <>
            
            <NewTrip callback={getAllTrips}></NewTrip>
          </>
          :<></>
        }
        {
          newCustForm && isAuthenticated
          ?
          <>
            
            <CustomerForm callback={getAllTrips}></CustomerForm>
          </>
          :<></>
        }
        
      </div>
    </div>
  );
}

export default App;
