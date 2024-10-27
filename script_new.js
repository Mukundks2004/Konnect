// Initialize data
const graphData = {
    nodes: [],
    links: []
};

// Set dimensions
const width = 600;
const height = 600;

// Create an SVG container
const svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create force simulation
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(50))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Function to update the graph
function updateGraph() {
    // Bind nodes and links
    const links = svg.selectAll(".link")
        .data(graphData.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", 2);

    const nodes = svg.selectAll(".node")
        .data(graphData.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", "steelblue")
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    // Update simulation
    simulation.nodes(graphData.nodes);
    simulation.force("link").links(graphData.links);
    simulation.on("tick", () => {
        links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

// Drag functions
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Add nodes on click
svg.on("click", function(event) {
    const coords = d3.pointer(event);
    const newNode = { id: `node${graphData.nodes.length + 1}`, x: coords[0], y: coords[1] };
    
    graphData.nodes.push(newNode);
    
    // Optionally, add a random link to an existing node
    if (graphData.nodes.length > 1) {
        const randomIndex = Math.floor(Math.random() * (graphData.nodes.length - 1));
        graphData.links.push({ source: newNode, target: graphData.nodes[randomIndex] });
    }

    updateGraph();
});

// Initialize graph
updateGraph();
