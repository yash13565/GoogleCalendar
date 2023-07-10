import React, {useMemo, useState  } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import Scheduler from 'devextreme-react/scheduler';
import { FcGoogle } from 'react-icons/fc';
import './DouleButton.css';
import 'react-calendar/dist/Calendar.css';
import { GoogleLoginButton } from 'react-social-login-buttons';



const config = {
  "clientId": '282333590393-j1482v39p73877a8gh4kvb8ud3e20g0c.apps.googleusercontent.com',
  "apiKey": 'AIzaSyCKkTFQ6CIaYSA4XfssctXacw_B65-V93g',
  "scope": "https://www.googleapis.com/auth/calendar.events",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

const views = ['week', 'month'];
const currentDate = new Date();
const apiCalendar = new ApiCalendar(config);

const DoubleButton = () => {

  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listCalendar,setListCalendar] = useState([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const handleItemClick = async (name) => {
    if (name === 'sign-in') {
      console.log('User clicked sign in.');
      try {
        const response = await apiCalendar.handleAuthClick();
        console.log(response);
      } catch (error) {
        console.log('Error occurred during sign in:', error);
      }
    } else if (name === 'sign-out') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        apiCalendar.handleSignoutClick();
        console.log('User signed out successfully.');
        window.location.reload();
      } else {
        console.log('Sign out canceled.');
      }
    }
  };
  console.log(events,'events')
  const handleCreateEvent = () => {
    const calendarId = 'official23021999@gmail.com';
    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    const accessToken = 'ya29.a0AbVbY6MmkTDg0Dgb-BVQYnFmgwx07ieWN5j5Hej9TaMQRXGXLp_Na8Zgm8oad_QpR2oi6XoQ74Q6LkC0UZx5SXjoF3_UXRD84qXLqbmM8EbBwlXAVr5AvA1Wo8ssgzer1nn9x9IYLOV7vEjEuchA0hq2Ec9UaCgYKAQMSARESFQFWKvPlX9_8GdeKGkTKAY44DwvMVA0163';
    const date = prompt('Enter the date for the event (YYYY-MM-DD):');
    const summary = prompt('Enter the summary for the event:');
    const selectedTime = prompt('Enter the time for the event (HH:mm):');
    const event = {
      start: {
        dateTime: `${date}T${selectedTime}:00+05:30`,
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: `${date}T${selectedTime}:00+05:30`,
        timeZone: 'Asia/Kolkata'
      },
      summary: summary,
      description: 'This is a custom event created via the Google Calendar API.'
    };
    console.log(event, " event")
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
      .then(response => response.json())
      .then(data => console.log('Event created:', data))
      .catch(error => console.error('Error creating event:', error));
  };


  const showPreviousEvent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const showNextEvent = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const listUpcomingEvents = () => {
    apiCalendar.listUpcomingEvents(20).then(({ result }) => { console.log(result.items); setEvents(result.items); setCurrentIndex(0); });

  };

   async function listCalendars (){
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList')
      // const data = await response.json()
      console.log(response,'hello')
   }
  const render = useMemo(() => {
    return events.map((event) => {
      const { summary, start, end } = event;
      return {
        text: summary,
        startDate: start?.dateTime || start?.date,
        endDate: end?.dateTime || end?.date
      };
    });
  }, [events]);

 

  const handleDeleteEvent = (eventId) => {
    const calendarId = 'official23021999@gmail.com';
    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
    const accessToken = 'ya29.a0AbVbY6NLWGSSFdYbbk4Ac7f4ngTOe957Mq7ePlop747Y3eWBvMsHiMwxuNkdQmaJqiEaldsvlIJY8at-_FxIFJ4H3VwBMUVivlwbeBfkM8KTMtzvrbJfr0-h3KZqP3qoiwWxCjEGQBCAMTtDuFgZyD075-79aCgYKAT4SARESFQFWKvPlF4paLe5M8yVmGt9Z-w59NQ0163';

    fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        if (response.ok) {
          console.log('Event deleted successfully');
          // Remove the deleted event from the events array
          const updatedEvents = events.filter(event => event.id !== eventId);
          setEvents(updatedEvents);
          alert("Confirm to delete with ok")
        } else {
          console.error('Error deleting event:', response.status);
        }
      })
      .catch(error => console.error('Error deleting event:', error));
  };

  return (
    <div className="container">
      <div className="header">
        <p style={{ marginRight: "24rem", color: "white", fontSize: "1rem" }}> Custom calendar </p>
        <p style={{ marginRight: "2rem" }}>Today: {currentDateTime.toLocaleDateString()}</p>
        <p>Time: {currentDateTime.toLocaleTimeString()}</p>
        <button onClick={() => handleItemClick('sign-in')} style={{ borderRadius: "1rem", width: "5vw" }}><FcGoogle />Sign In</button>
        <button onClick={() => handleItemClick('sign-out')} style={{ borderRadius: "1rem", width: "5vw" }}><FcGoogle />Sign Out</button>

      </div>

      <div className='mycont'>
        <div className="sidebar">
          <button
            onClick={(e) => {
              const title = prompt('Enter task title:');
              const time = parseInt(prompt('Enter task time (in minutes):'), 20);
              if (title && time) {
                const eventFromNow = { summary: title, time };
                apiCalendar.createEventFromNow(eventFromNow)
                  .then((result) => { console.log(result); })
                  .catch((error) => { console.log(error); });
              }
            }}  > Create Event from now</button>
          <GoogleLoginButton />
          <button onClick={() => handleCreateEvent()}>NEW EVENT</button>
          <button onClick={() => handleDeleteEvent(events[currentIndex].id)}>DELETE</button>
          <button onClick={listUpcomingEvents}>List upcoming events</button>
          <button onClick={listCalendars}>ListCalendars</button>
          <div>
          </div>
          <div className="events">
            <h4>Events</h4>
            {events.length === 0 && <p>No events to show</p>}
            {events.length > 0 && (
              <>
                <button disabled={currentIndex === 0} onClick={showPreviousEvent}>Previous</button>
                <div className="event-details">
                  <p> <strong>Event ID:</strong> {events[currentIndex].id} </p>
                  <p> <strong>Summary:</strong> {events[currentIndex].summary} </p>
                  <p> <strong>Start Date:</strong> {events[currentIndex].start.dateTime} </p>
                  <p> <strong>End Date:</strong> {events[currentIndex].end.dateTime} </p>
                </div>
                <button disabled={currentIndex === events.length - 1} onClick={showNextEvent}> Next </button>

              </>
            )}

          </div>
        </div>
        <div className='scheduler'>
          <Scheduler
            views={views}
            height={700}
            defaultCurrentView="month"
            defaultCurrentDate={currentDate}
            dataSource={render}
            editing={false}
          />
        </div>
      </div>
    </div>

  );
};

export default DoubleButton;

