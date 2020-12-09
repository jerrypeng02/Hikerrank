import React, { Component } from 'react';
import InfiniteCalendar, {
    Calendar,
    defaultMultipleDateInterpolation,
    withMultipleDates,
  } from 'react-infinite-calendar';
  import 'react-infinite-calendar/styles.css';
import './calendar.css'

const MultipleDatesCalendar = withMultipleDates(Calendar);

class EventCalendar extends Component {

      constructor(props) {
        super(props);

        this.state = {
          id: String(sessionStorage.getItem('id')),
          date_list: []
        }
      }
      

      componentDidMount(){
        var date_array = new Array();

        fetch('/api/event/')
        .then(res => res.json())
        .then (data => {
            var data_size = Object.keys(data).length
            for (let index = 0; index < data_size; index++) {
              const element = data[index];
              var event_time = new Date(element['event_time'])
              // if the user is the initiator of the event
              if (String(element['initiator']).split('/').includes(this.state.id) && element['status']=='normal') {
                date_array.push(event_time);
                this.setState({
                  date_list: date_array
                },()=>{console.log(this.state)})
              }
              var participants = element['participants']
              // if the user is a participant of the event
              participants.forEach(e => {
                if (String(e).split('/').includes(this.state.id) && element['status']=='normal') {
                  date_array.push(event_time);
                  this.setState({
                    date_list: date_array
                  },()=>{console.log(this.state)})
                }
              });
            }
        });
      }

      render () {
        var today = new Date();
        // var event_date1 = new Date("2020-11-21T09:38:00Z")
        // var event_date2 = new Date("2020-12-12T14:18:00Z")
        // var date_array = new Array();
        // date_array.push(event_date1)
        // date_array.push(event_date2)
        var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        
        return(
          <div className="event-calendar-container">
            <InfiniteCalendar
                Component={MultipleDatesCalendar}
                interpolateSelection={defaultMultipleDateInterpolation}
                // selected={[new Date(2020, 11, 10), new Date(2020, 11, 18), new Date()]}
                selected={this.state.date_list}
                width={380}
                height={270}
                // selected={today}
                minDate={lastWeek}
                
            />
          </div>
        )
      }
}

export default EventCalendar;