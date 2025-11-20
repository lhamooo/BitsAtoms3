const margin = { top: 10, right: 30, bottom: 40, left: 70 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

async function draw() {
    try {
        const response = await fetch("temp.json");
        const rawData = await response.json();

        let output = "";
        rawData.forEach(item => {
            output += `${item.time} : ${item.temperature}°C\n`;
        });
        document.getElementById("temp").innerText = output;

       
        const data = rawData.map(d => ({
            time: +d.time.split(":")[0],      
            temperature: +d.temperature
        }));

       
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.time))  
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([
                d3.min(data, d => d.temperature) - 0.5,
                d3.max(data, d => d.temperature) + 0.5
            ])
            .range([height, 0]);

        
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(10));

        
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 5)
            .attr("text-anchor", "middle")
            .style("fill", "white")  
            .style("margin-top", "20vh")  
            .text("Zeit");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .style("fill", "white")  
            .text("Temperatur");

        const line = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.temperature));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 4)
            .attr("d", line);

        
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.time))
            .attr("cy", d => y(d.temperature))
            .attr("r", 3)
            .attr("fill", "orange");

    } catch (error) {
        console.error("Error loading or drawing data:", error);
    }
}


document.addEventListener("DOMContentLoaded", draw);
