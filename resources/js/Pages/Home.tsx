import React, {useState, useEffect} from "react";
import { InertiaLink } from '@inertiajs/inertia-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios, { AxiosResponse } from "axios";
import { months } from "moment";

interface calendarAPI {
    event: string,
    mon: string,
    day: string
}

const Home = () => {
    const defaultProps:calendarAPI[] = [];

    const [data, setData]: [calendarAPI[], (data: calendarAPI[]) => void] = useState(defaultProps);
    const [Load, setLoad] = useState(false);
    const [DateFrom, setDateFrom] = useState(new Date());
    const [DateTo, setDateTo]  = useState(new Date());
    const [Event, setEvent] = useState("");
    const [Day, setDay] = useState<string[]>([]);   
    const getEvent = (e: any) => {
        let event = e.target.value; 
        setEvent(event);
    }

    const [CYear , setCYear] = useState(0);
    const [CMon , setCMon] = useState("");
    
    const getDay = (event: any) => {
        let v = Day.indexOf(event.target.id);
        if(event.target.checked == true && v == -1) {
            Day.push(event.target.id);
        }
        else if(!event.target.checked && v >= 0) {
            Day.splice(v, 1);
        }
    }

    const save = () => {
        const formData = new FormData();
        formData.append('Event', Event);
        formData.append('DateFrom', DateFrom.toISOString().split('T')[0]);
        formData.append('DateTo', DateTo.toISOString().split('T')[0]);
        for(let i = 0; i < Day.length; i++) {
            formData.append('Day[]', Day[i]);
        }
        setLoad(true);
        axios
        .post("/api/v1/calendar", formData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then(response => {
            console.log(response.data);
            setData(response.data);
            setLoad(false);
        })
        .catch(ex => {
            const error =
            ex.response.status === 404
              ? "Resource not found"
              : "An unexpected error has occurred";
            console.log("not ok");
            setLoad(false);
        });
    };

    return (
        <React.Fragment>   
            <div className="container">
            <div className="row mt-4">
                <div className="col-md-12">
                        <input className="form-control" type="text" 
                        placeholder="Event" onChange={getEvent}
                        name="Event" value={Event} />
                </div>
            </div>
            <div className="row mt-4 d-flex justify-content-center">
                <div className="col-md-3">
                    <div className="active-cyan-4 mb-4">
                        <DatePicker selected={DateFrom} name="DateFrom"
                        dateFormat="yyyy-MM-dd"
                        onChange={(date: Date) => setDateFrom(date)} />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="active-cyan-4 mb-4">
                        <DatePicker selected={DateTo} name="DateTo"
                        dateFormat="yyyy-MM-dd"
                        onChange={(date: Date) => setDateTo(date)} /> 
                    </div>
                </div>
            </div>
            <div className="row mt-4 justify-content-center">
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Mon" onChange={getDay}></input>
                        <label className="form-check-label" >Mon</label>
                    </div>
                </div>
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Tue"onChange={getDay}></input>
                        <label className="form-check-label" >Tue</label>
                    </div>
                </div>
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Wed" onChange={getDay}></input>
                        <label className="form-check-label" >Wed</label>
                    </div>
                </div>
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Thu" onChange={getDay}></input>
                        <label className="form-check-label">Thu</label>
                    </div>
                </div>
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Fri" onChange={getDay}></input>
                        <label className="form-check-label">Fri</label>
                    </div>
                </div>
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Sat" onChange={getDay}></input>
                        <label className="form-check-label">Sat</label>
                    </div>
                </div>
                <div className="col-md-1">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="Sun" onChange={getDay}></input>
                        <label className="form-check-label">Sun</label>
                    </div>
                </div>
            </div>
            <div className="row mt-4 justify-content-center">
                <button className="btn btn-primary btn-lg active" id="Add" onClick={save} >Add</button>
            </div>
            <div className="row mt-5 d-flex justify-content-center">
                <div className="col-md-6">
                    {
                        Load ?  
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        <table className="table table-border">
                        <tbody>
                            {
                                data.map((datas, i) => {
                                    if(datas.mon) {
                                        return (
                                            <tr key={i}>
                                                <td><h3>{datas.mon}</h3></td>   
                                            </tr>
                                            );   
                                    }
                                    else {
                                        return (
                                            <tr key={i}>
                                                <td>{datas.day}</td> 
                                                <td>{datas.event}</td>   
                                            </tr>
                                            );   
                                    }     
                                })
                            }
                        </tbody>
                    </table>
                    }
                   
                </div>
            </div>
        </div>
        </React.Fragment>   
    );
};

export default Home;