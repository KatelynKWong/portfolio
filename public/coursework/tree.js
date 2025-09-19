// Loading JSON file
fetch("/coursework/courses.json")
  .then(res => {
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return res.json();
  })
  .then(data => drawGraph(data))
  .catch(err => console.error("Error loading JSON:", err));


  function drawGraph(data) {
  const svg = d3.select("#tree svg");
  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;
  const baseRadius = width / 50;

  // Generate JSON Links
  const links = data.edges.map(e => ({ source: e.from, target: e.to }));

  // Force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Draw links
  const defs = svg.append("defs");

  defs.append("marker") // Making arrow
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", baseRadius) // move arrow to edge of circle
    .attr("refY", 0)
    .attr("markerWidth", baseRadius / 2) // scales with SVG
    .attr("markerHeight", baseRadius / 2)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#e2e1e0");

  const link = svg.append("g")
    .attr("stroke", "#e2e1e0")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrow)");  // <-- add arrow


  // Node color
  const color = d => {
    if (d.subject === "Math") return "#fc8472";
    if (d.subject === "Data Science") return "#65cdba";
    if (d.subject === "Econ") return "#f8b267";
    if (d.subject === "Business") return "#ffe8ae";
    return "lightgray";
  };

  const tooltip = d3.select("#tooltip");

  // Create node groups (circle + text)
  const nodeGroup = svg.append("g")
    .selectAll("g")
    .data(data.nodes)
    .join("g")
    .call(drag(simulation));

  nodeGroup.append("circle")
    .attr("r", d => (d.size || 0) * baseRadius / 25) // scale according to width
    .attr("fill", color);


    nodeGroup.append("text")
    .text(d => d.id)
    .attr("font-size", baseRadius * 0.5) // scale font with SVG
    .attr("text-anchor", "middle")
    .attr("dy", baseRadius * 0.3);

  // Tooltip events on group (so circle + text trigger it)
  nodeGroup
    .style("cursor", "pointer")
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(d.name);
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  // Adding legend
  // Define your subjects and colors
  const subjects = [
    { name: "Math", color: "#fc8472" },
    { name: "Data Science", color: "#65cdba" },
    { name: "Econ", color: "#f8b267" },
    { name: "Business", color: "#ffe8ae" }
  ];

  // Add legend container
  const legend = d3.select("#tree svg")
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 20)"); // top-left position

  // Add legend items
  const legendItem = legend.selectAll("g")
    .data(subjects)
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * 25})`); // spacing between items

  // Draw color boxes
  legendItem.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", d => d.color)
    .attr("stroke", "#333");

  // Add text labels
  legendItem.append("text")
    .attr("x", 30)
    .attr("y", 15) // vertically center text with box
    .text(d => d.name)
    .attr("font-size", 14)
    .attr("fill", "#e2e1e0");

  // Simulation tick
  const NODE_RADIUS = 25;
  const PADDING = 40;
  const SPACING = 20;
  const GROUP_STRENGTH = 0.08;
  const CENTER_Y = height / 2;

  // Define group centers
  const groups = {
    "Math": { x: width * 0.25, y: CENTER_Y },
    "Stat": { x: width * 0.5, y: CENTER_Y },
    "CS": { x: width * 0.75, y: CENTER_Y },
    "Other": { x: width * 0.5, y: CENTER_Y }
  };

  // Apply forces
  
  simulation
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX(d => groups[d.subject]?.x || groups["Other"].x).strength(GROUP_STRENGTH))
    .force("y", d3.forceY(d => groups[d.subject]?.y || groups["Other"].y).strength(GROUP_STRENGTH))
    .force("collide", d3.forceCollide().radius(NODE_RADIUS + SPACING))
    .force("center", d3.forceCenter(width / 2, CENTER_Y));

  // Single tick handler
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup.attr("transform", d => {
      // Clamp nodes inside SVG with padding
      d.x = Math.max(PADDING, Math.min(width - PADDING, d.x));
      d.y = Math.max(PADDING, Math.min(height - PADDING, d.y));
      return `translate(${d.x},${d.y})`;
    });
  });

  // Adjusting forces to the width of svg
  const linkDistance = svgWidth / 8; // example
  const collisionRadius = (d.size || 20) * baseRadius / 20 + 5;

  simulation.force("link", d3.forceLink(links).id(d => d.id).distance(linkDistance));
  simulation.force("collide", d3.forceCollide(collisionRadius));


  // Dragging
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  }
}
