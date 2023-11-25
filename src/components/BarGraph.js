

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const BarGraph = ({ data, type }) => {
  const svgRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Remove previous graph before rendering a new one
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);

    // Set the dimensions of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Check if data is provided and has the expected structure
    if (!Array.isArray(data) || data.length === 0 || !('month' in data[0]) || !('total' in data[0])) {
      // Handle the case when data is not in the expected format
      svg
        .append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', height / 2 + margin.top)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', 'red')
        .text('Invalid data format. Please check the data structure.');
      setLoading(false);
      return;
    }

    // Create scales
    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Set the domain of the scales based on all months
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    xScale.domain(allMonths);

    // Find the maximum expense value among all months
    const maxExpense = d3.max(data, (d) => d.total);

    // Set the domain of the yScale based on the maximum expense value
    yScale.domain([0, maxExpense]);

    // Create a group for the lines
    const linesGroup = svg.append('g').attr('class', 'lines-group');

    // Add horizontal lines for money ranges
    [200, 400, 600, 800, 1000, 1200, 1400, 1600,].forEach((money) => {
      linesGroup
        .append('line')
        .attr('class', 'line-y')
        .attr('x1', margin.left)
        .attr('y1', yScale(money) + margin.top)
        .attr('x2', width + margin.left)
        .attr('y2', yScale(money) + margin.top)
        .style('stroke', 'lightgrey')
        .style('stroke-width', 1);
    });

    // Create a group for the bars
    const barsGroup = svg.append('g').attr('class', 'bars-group');

    // Add the bars to the graph
    barsGroup
      .selectAll('.bar')
      .data(allMonths.map(month => ({ month, total: data.find(d => d.month === month)?.total || 0 })))
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.month) + margin.left)
      .attr('y', (d) => yScale(d.total) + margin.top)
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.total))
      .attr('fill', (d) => d.total > 0 ? 'steelblue' : 'lightgrey'); // Highlight the months with expenses

    // Add vertical lines from each bar to the x-axis
    barsGroup
      .selectAll('.line-x')
      .data(allMonths.map(month => ({ month, total: data.find(d => d.month === month)?.total || 0 })))
      .enter()
      .append('line')
      .attr('class', 'line-x')
      .attr('x1', (d) => xScale(d.month) + margin.left + xScale.bandwidth() / 2)
      .attr('y1', height + margin.top)
      .attr('x2', (d) => xScale(d.month) + margin.left + xScale.bandwidth() / 2)
      .attr('y2', (d) => yScale(d.total) + margin.top)
      .style('stroke-width', 2);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Add chart title
    // svg
    //   .append('text')
    //   .attr('x', width / 2 + margin.left)
    //   .attr('y', margin.top / 2)
    //   .attr('text-anchor', 'middle')
    //   .style('font-size', '16px')
    //   .text(type === 'monthly' ? 'Monthly Expenses' : 'Yearly Expenses');

    setLoading(false);
  }, [data, type]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <svg ref={svgRef} width={600} height={400} />
        </>
      )}
    </div>
  );
};

export default BarGraph;
