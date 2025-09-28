import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

function HomePage() {

  const [budgetData, setBudgetData] = useState([]);

  // ADD: guards/handles
  const fetchedOnceRef = useRef(false);
  const chartInstanceRef = useRef(null);

  // 👇 Pastel palette (Rent, Groceries, Utilities, Transport, Entertainment, Savings, Eat out)
  const PASTEL_COLORS = [
  '#FF6F9A', // Rent (pink)
  '#4AA3DF', // Groceries (sky blue)
  '#F3B567', // Utilities (apricot)
  '#57C7C2', // Transport (teal)
  '#7F61D9', // Entertainment (lavender)
  '#D8D8D8', // Savings (light gray)
  '#F6E2B3'  // Eat out (light tan)
]
  var dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: PASTEL_COLORS, // <- updated palette
      },
    ],
    labels: [],
  };

  const fetchData = async () => {
    // prevent multiple fetch/draw cycles
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    axios
      .get('http://localhost:3001/budget') // use '/budget' if you set the CRA proxy
      .then((res) => {
        console.log('Fetched /budget:', res.data);
        for (var i = 0; i < res.data.myBudget.length; i++) {
          dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
          dataSource.labels[i] = res.data.myBudget[i].title;
        }
        setBudgetData(res.data.myBudget);
        createPieChart();
        donutChart(res.data.myBudget);
      })
      .catch((err) => {
        console.log('Axios error:', err);
      });
  };

  useEffect(() => {
    console.log('Fetching data...');
    fetchData();
  }, [fetchData]); // ref guard above prevents looping

  function createPieChart() {
    const canvas = document.getElementById('myChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // destroy previous chart if any
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: dataSource,
    });
  }

  const donutChart = (data) => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // use the existing <svg id="donut-chart">
    const root = d3.select('#donut-chart');
    root.selectAll('*').remove(); // clear prior draw
    root.attr('width', width).attr('height', height);

    const svg = root
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // 👇 same pastel palette for D3
    const customColors = PASTEL_COLORS;

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.title))
      .range(customColors);

    const pie = d3.pie().value((d) => d.budget).sort(null);

    const arc = d3.arc().innerRadius(radius * 0.3).outerRadius(radius * 0.8);

    const outerArc = d3.arc().innerRadius(radius * 0.85).outerRadius(radius * 0.85);

    const arcs = svg
      .selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.title))
      .attr('class', 'slice');

    // left side labels
    arcs
      .filter((d) => (d.endAngle + d.startAngle) / 2 < Math.PI)
      .append('text')
      .attr('transform', function (d) {
        const pos = outerArc.centroid(d);
        return 'translate(' + pos + ')';
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text((d) => d.data.title);

    arcs
      .filter((d) => (d.endAngle + d.startAngle) / 2 < Math.PI)
      .append('polyline')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('points', function (d) {
        const pos = outerArc.centroid(d);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    // right side labels
    arcs
      .filter((d) => (d.endAngle + d.startAngle) / 2 >= Math.PI)
      .append('text')
      .attr('transform', function (d) {
        const pos = outerArc.centroid(d);
        pos[0] = pos[0] - 10;
        return 'translate(' + pos + ')';
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text((d) => d.data.title);

    arcs
      .filter((d) => (d.endAngle + d.startAngle) / 2 >= Math.PI)
      .append('polyline')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('points', function (d) {
        const pos = outerArc.centroid(d);
        pos[0] = pos[0] - 10;
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });
  };

  return (
    <main className="center" id="main">
      <div className="page-area">
        <article>
          <h1>Stay on track</h1>
          <p>
            <meta name="description" content="Tips for staying on track" />
            <>
              Do you know where you are spending your money? If you really stop to track it down,
              you would get surprised! Proper budget management depends on real data... and this
              app will help you with that!
            </>
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
              What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they to live happier lives... since they expend without guilt or fear...
            because they know it is all good and accounted for.
          </p>
        </article>

        <article>
          <header>
            <h1> Free </h1>
          </header>
          <p>This app is free!!! And you are the only one holding your data!</p>
        </article>

        <article>
          <header>
            <h1> Stay on track </h1>
          </header>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
              What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they to live happier lives... since they expend without guilt or fear...
            because they know it is all good and accounted for.
          </p>
        </article>

        <article>
          <h1>Chart</h1>
          <p>
            <canvas id="myChart" width="500" height="320"></canvas>
          </p>
        </article>

        <div>
          <h1>D3.js</h1>
          <svg id="donut-chart" style={{ height: 400, width: 450 }}></svg>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
