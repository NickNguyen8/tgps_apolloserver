import React from 'react';
import { Bar } from 'react-chartjs'
const BOOKING_BUCKETS ={
    'Cheap': {
        min: 0,
        max: 8.99
        },
    'Normal':  {
        min: 9,
        max: 20.99
        },
    'Expensive':  {
        min: 21,
        max: 100000
        }

}

const bookingChart= props=>{
    const chartData ={  labels: [],
                        datasets: [          
                        {   fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: []}] 
                    };
    for (const bucket in BOOKING_BUCKETS){
        const filteredBookingsCount = props.bookings.reduce(
            (prev,current)=>{                
                if (current.event.price >= BOOKING_BUCKETS[bucket].min
                    &&
                    current.event.price <= BOOKING_BUCKETS[bucket].max
                    ){
                    return prev + 1;    
                }
                else{
                    return prev;
                }
            }
            ,0
        );
        chartData.labels.push(bucket);  
        chartData.datasets[0].data.push(filteredBookingsCount);

    }
    console.log(chartData);

    return ( <Bar data={chartData}  /> )
    //<p> This chart </p> 
};

export default bookingChart;