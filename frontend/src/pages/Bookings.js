import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

import BookingList from '../components/Bookings/BookingList/BookingList.js';
import BookingChart from '../components/Bookings/BookingChart/BookingChart.js';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls.js';




import Spinner from '../components/Spinner/Spinner';


class BookingsPage extends Component{
    
    isActive = true;

    static contextType = AuthContext;


    state ={
        isLoading: false,
        bookings: [],
        outputType: 'list'
    }
    cancelBookingHandler=bookingId=>{
        console.log('booking to cancel ' + bookingId);
        this.setState({isLoading: true});

        const requestBody = {
            query: ` 
                mutation cacnelBooking($bookingId: ID! )
                    { cancelBooking(bookingId: $bookingId) {
                        _id
                    }
                }
            `,
            variables: {
                bookingId: bookingId
            }
        };
        
        console.log(requestBody);
        
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type': 'application/json'
                ,'Authorization': 'Bearer '+ this.context.token
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(resData=>{

            console.log(resData.data);
            //this.fetchEvents();
            this.setState(prevState =>{
                return {bookings: prevState.bookings.filter(e=> e._id !== bookingId ) };
            });


        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
        
        this.setState({isLoading: false});

    }

    componentDidMount(){
        this.fetchBookings();
    }

    fetchBookings(){
        console.log('fetch event  ' +this.state.isLoading);

        this.setState({isLoading: true});
        console.log('fetch event loading ' +this.state.isLoading);

        const requestBody = {
            query: ` 
                query{
                    bookings{
                        _id,
                        createdAt,
                        event{
                            _id,
                            title,
                            date,
                            price
                        }


                    }
                }
            `
        };
        
        console.log(requestBody);
        
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type': 'application/json'
                ,'Authorization': 'Bearer '+ this.context.token
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(resData=>{
            const bookings= resData.data.bookings;
            this.setState({bookings: bookings});
            console.log(bookings);

        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
        
        this.setState({isLoading: false});

    }
    componentWillUnmount(){
        this.isActive = false;
    }
    changeOutputTypeHandler = outputType => {
        if(outputType === 'list'){
            this.setState({outputType: 'list'});
        }
        else{
            this.setState({outputType: 'chart'});
        } 
    }
    render(){
        let content = <Spinner />;
        if(!this.state.isLoading){
            content = (
                <React.Fragment>
                    <BookingsControls 
                        activeOutputType={this.state.outputType} 
                        changeOutputTypeHandler={this.changeOutputTypeHandler} />
                    <div>
                        {this.state.outputType=== 'list'
                        ?
                        <BookingList
                            bookings={this.state.bookings}
                            cancelBooking={this.cancelBookingHandler}
                        />
                        :<BookingChart bookings={this.state.bookings} />
                        }
                    </div>

                </React.Fragment>
            );
        }

        return(
            <React.Fragment>
                {content}
            </React.Fragment>
            
        );
    
    }
}

export default BookingsPage;