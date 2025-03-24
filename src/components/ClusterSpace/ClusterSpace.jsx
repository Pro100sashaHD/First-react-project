import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { fetchTopics } from '../../API/api';

const ClusterSpace = () => {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    fetchTopics().then(data => {
      console.log('Данные загружены:', data); // Проверка данных
      setClusters(data);
    }).catch(error => {
      console.error('Ошибка при загрузке данных:', error);
    });
  }, []);

  useEffect(() => {
    if (clusters.length > 0) {
      const width = 800;
      const height = 600;
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };

      // Очищаем предыдущий график
      d3.select("#cluster-space").selectAll("*").remove();

      const svg = d3.select("#cluster-space")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 0]);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      svg.append("g")
        .attr("transform", `translate(0,${yScale(0)})`)
        .call(d3.axisBottom(xScale).ticks(5));

      svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(d3.axisLeft(yScale).ticks(5));


      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Ось X");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .style("text-anchor", "middle")
        .text("Ось Y");

      const tooltip = d3.select("#tooltip");

      // Добавляем кружки
      const circles = svg.selectAll("circle")
        .data(clusters)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x)) // Используем x из данных
        .attr("cy", d => yScale(d.y)) // Используем y из данных
        .attr("r", 5) 
        .attr("fill", d => colorScale(d.topic)) // Цвет в зависимости от topic
        .on("mouseover", (event, d) => {
          d3.select(event.target).attr("r", 8);

          // Подсвечиваем кружки с тем же topic
          circles.filter(circle => circle.topic === d.topic)
            .attr("r", 8);

          // Показываем подсказку с subtopic
          tooltip
            .style("opacity", 1)
            .html(`${d.subtopic}`);

          const tooltipWidth = tooltip.node().offsetWidth;
          const tooltipHeight = tooltip.node().offsetHeight;

          tooltip
            .style("left", `${event.pageX - tooltipWidth / 2}px`)
            .style("top", `${event.pageY - tooltipHeight + 35}px`);
        })
        .on("mousemove", (event) => {
          const tooltipWidth = tooltip.node().offsetWidth;
          const tooltipHeight = tooltip.node().offsetHeight;

          tooltip
            .style("left", `${event.pageX - tooltipWidth / 2}px`)
            .style("top", `${event.pageY - tooltipHeight + 35}px`);
        })
        .on("mouseout", (event, d) => {
          d3.select(event.target).attr("r", 5);

          // Убираем подсветку кружков
          circles.filter(circle => circle.topic === d.topic)
            .attr("r", 5);

          tooltip.style("opacity", 0);
        });

      console.log('График отрисован'); // Проверка отрисовки
    }
  }, [clusters]);

  return (
    <div>
      <div id="cluster-space"></div>
      <div id="tooltip"></div>
    </div>
  );
};

export default ClusterSpace;