import React from 'react'
import{Bar} from 'react-chartjs-2';
import{Chart,ArcElement}from 'chart.js';

Chart.register(ArcElement);

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};

export default function Graph() {
  return (
    <div className="flex justify-content max-w-xs mx-auto">
        <div className="item">
            <div className="chart-relative">
           <Bar data={data}></Bar>
           
            </div>
            <div className="flex flex-col py-10 gap-4">



            </div>
        </div>
    </div>
  )
}