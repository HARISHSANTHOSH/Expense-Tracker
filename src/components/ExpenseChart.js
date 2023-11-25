
import React, { useEffect, useRef, useCallback,useState } from 'react';
import * as d3 from 'd3';
import './ExpenseChart.css';
import { getAccessToken } from './authService'; 
import getCsrfToken from './CsrfToken.js'

const ExpensesByCategory = () => {
  const chartRef = useRef(null);

  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  const getRandomColor = useCallback(() => {
    // Generate a random hex color
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }, []);

  const getColorScale = useCallback((categories) => {
    // Check if color assignments are stored in local storage
    const storedColors = JSON.parse(localStorage.getItem('categoryColors')) || {};

    // Assign colors to categories or use stored assignments
    const colorScale = d3.scaleOrdinal()
      .domain(categories)
      .range(categories.map(category => storedColors[category] || getRandomColor()));

    // Store color assignments in local storage for consistency
    const newColorAssignments = colorScale.domain().reduce((acc, category) => {
      acc[category] = colorScale(category);
      return acc;
    }, {});

    localStorage.setItem('categoryColors', JSON.stringify(newColorAssignments));

    return colorScale;
  }, [getRandomColor]);

  const drawChart = useCallback((data, colorScale) => {
    d3.select(chartRef.current).selectAll('*').remove();

    const width = 290;
    const height = 290;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
      .value(item => item.count);

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', path)
      .attr('fill', (item) => colorScale(item.data.category));

    arcs.append('text')
      .attr('transform', item => {
        const position = path.centroid(item);
        position[0] = position[0] * 1.5; // Adjust horizontal positioning
        position[1] = position[1] * 1.5; // Adjust vertical positioning
        return `translate(${position})`;
      })
      .attr('dy', '0.35em')
      .style('font-size', '13px') // Adjust font size as needed
      .text(item => `${item.data.category} (${((item.endAngle - item.startAngle) / (2 * Math.PI) * 100).toFixed(0)}%)`)
      .style('font-weight', '450')
      .style('fill', 'white')
      .style('text-anchor', 'middle');
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // const jwtToken = localStorage.getItem('accessToken');
      const jwtToken= getAccessToken()
      const response = await fetch('http://127.0.0.1:8000/api/expensechart/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const colorScale = getColorScale(data.map(item => item.category));
        drawChart(data, colorScale);
      } else {
        console.error('API call returned a non-200 status code');
      }
    } catch (error) {
      console.error('Error while fetching data:', error);
    }
  }, [drawChart, getColorScale,csrfToken]);

  useEffect(() => {
    fetchData(); // Initial fetch when the component mounts

    const handleExpenseAdded = () => {
      fetchData(); // Fetch updated data and redraw the pie chart
    };

    window.addEventListener('expenseAdded', handleExpenseAdded);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseAdded);
    };
  }, [fetchData]); // Include fetchData in the dependency array

  return (
    <div className='expense-container'>
      <h2 style={{ color: 'black', fontWeight: '400' }}>Expenses by Category</h2>
      <div className='expensechart' ref={chartRef}></div>
    </div>
  );
};

export default ExpensesByCategory;


