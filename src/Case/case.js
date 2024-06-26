// import { Identity } from '@mui/base';
import {
  Badge,
  ContactEmergency,
  Done,
  Email,
  EmailRounded,
  PendingActions,
  PermIdentity,
  Phone,
} from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import InputModal from "../Modal/InputModal";
import { useNavigate } from "react-router-dom";
import map from "../images/map.png"
const Case = () => {
  const navigate = useNavigate();

  // Function to navigate to the home route
  const navigateToHome = () => {
    navigate("/");
  };
  const [isModal, setIsModal] = useState(false);
  function handleClick() {
    setIsModal(true);
  }
  // get id from url
  const id = window.location.pathname.split("/")[2];
  console.log("id is ", id);
  // get emergency data from id
  const [data, setData] = useState([]);
  const [emergencyData, setEmergencyData] = useState([]);
  const getEmergenciesData = async () => {
    // localStorage.removeItem('emergenciesData');
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/emergency/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      console.log("response data:", responseData.data);

      setData(responseData.data);
      console.log("data after fetching:", data);
      const filteredEmergencyData = await responseData.data.filter(
        (item) => item._id === id
      );
      console.log("filtered emergency data:", filteredEmergencyData);
      // convert time to indian time
      filteredEmergencyData[0].createdOn = new Date(
        filteredEmergencyData[0].createdOn
      ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      setEmergencyData(filteredEmergencyData[0]);
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    getEmergenciesData();
  }, []);
  useEffect(() => {
    console.log("data after changing:", emergencyData);
  }, [emergencyData]);
  return (
    <>
      {emergencyData === null || emergencyData.length === 0 ? (
        <div className="w-full h-full justify-center items-center flex">
          <h1 className="text-3xl font-bold text-center ">Loading....</h1>
        </div>
      ) : (
        <div className="flex gap-5  p-5 absolute right-0 flex-col items-center bg-slate-00 ">
          <h1 className="text-3xl  text-center font-extrabold">Case Details</h1>
          <div
            className="student-details bg-slate-100 flex items-center gap-5 justify-center text-xl mx-10 p-5 shadow-sm shadow-slate-200 rounded-sm relative"
            style={{ left: "2vw", width: "80vw" }}
          >
            <div className="student-image">
              <img
                src={emergencyData.user.imageUrl}
                alt="profile"
                className="w-40 rounded"
              />
            </div>
            <div className="student-info text-md" style={{ minWidth: "25%" }}>
              <p className="p-1.5 font-semibold ">
                <PermIdentity /> {emergencyData.user.username}
              </p>
              <p className="p-1.5 font-semibold ">
                <Badge /> {emergencyData.user.rollNo}
              </p>
              <p className=" capitalize m-1 font-semibold ">
                <Email /> {emergencyData.user.email}
              </p>
              <p className="p-1.5 font-semibold ">
                <Phone /> {emergencyData.user.phone}
              </p>
            </div>
            <div
              className="student-contacts min-h-full justify-start flex flex-col items-start"
              style={{ minWidth: "24%" }}
            >
              <h1 className="text-2xl text-center font-bold">
                Emergency Contacts
              </h1>
              {emergencyData.user.contacts.map((contact) => {
                return (
                  <div className="emergency-contacts text-md flex items-center  gap-1 w-full">
                    <div className="m-0.5">
                      <ContactEmergency className="text-3xl" fontSize="large" />
                    </div>
                    <div className="m-0.5 p-2">
                      <p>
                        <PermIdentity /> {contact.contactName}
                      </p>
                      <p>
                        <Phone /> {contact.contactPhone}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="case-details ">
              <p className="m-1 p-2 font-semibold capitalize ">
                <span className="text-slate-500">Near : </span>
                {emergencyData.landmark}
              </p>
              <p
                className={`m-1 p-2 font-bold  capitalize ${
                  emergencyData.status === "resolved"
                    ? "text-green-400"
                    : "text-red-500"
                } `}
              >
                <span className="text-slate-500">Status : </span>
                {emergencyData.status === "pending" ? (
                  <PendingActions />
                ) : (
                  <Done />
                )}
                {emergencyData.status}
              </p>
              <p className="m-1 p-2 font-semibold ">
                <span className="text-slate-500">Happened On : </span>
                {emergencyData.createdOn}
              </p>
              <p className="m-1 p-2 font-semibold ">
                <span className="text-slate-500">Time took to resolve : </span>{" "}
                {emergencyData.timeTakenToResolve}
              </p>
            </div>
          </div>
          <div
            className="description  bg-slate-50 p-5 shadow-sm shadow-slate-200 rounded-sm wrapper mx-10 relative "
            style={{ width: "80vw", left: "2vw" }}
          >
            <p className="text-xl font-semibold capitalize p-1">
              {" "}
              more about case{" "}
            </p>
            <div className="flex justify-start items-center gap-4">
              <p className="font-semibold text-lg">Sensitivity :</p>
              <p className="text-lg font-light py-2 m-1">
                {emergencyData.sensitivity}{" "}
              </p>
            </div>
            <div className="flex justify-start items-start gap-4 my-2">
              <p className="font-semibold text-lg ">Description:</p>
              <p className="text-lg font-light ">
                {emergencyData.description}{" "}
              </p>
            </div>
          </div>
          <div className="flex justify-start items-center flex-col gap-3 w-full m-2 p-1 ">
            <h2 className='text-lg font-semibold '> Click to see location:</h2>
            {/* // on click it should open new tab in google map with location of the user */}
            <div className="flex justify-center">
              <a href={`https://maps.google.com/?q=${emergencyData.latitude},${emergencyData.longitude}`} target='_blank' rel="refferer noreferrer" className='text-blue-500 font-semibold flex justify-center flex-col items-center'>
                <p>
                  Open in Google Maps
                </p>
                <img src={map} alt='nothing' className='h-25 w-2/3 text-center ' />
              </a>
            </div>
          </div>

          <div className="flex gap-5 ">
            <div className="back button">
              <button
                onClick={navigateToHome}
                className="text-black bg-amber-200 rounded-md p-2  text-xl font-bold m-4"
              >
                Home
              </button>
            </div>
            {emergencyData.status === "pending" ? (
              <div className="matter-resolved">
                <button
                  onClick={handleClick}
                  className="text-white rounded-md bg-green-500 p-2  text-xl font-bold m-4"
                >
                  Mark Resolved
                </button>
              </div>
            ) : (
              <div className="update case">
                <button
                  onClick={handleClick}
                  className="text-white bg-slate-500 rounded-md p-2  text-xl font-bold m-4"
                >
                  Update
                </button>
              </div>
            )}
          </div>
          {isModal ? (
            <InputModal
              close={setIsModal}
              id={emergencyData._id}
              des={emergencyData.description}
              sensitivity={emergencyData.sensitivity}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

export default Case;
