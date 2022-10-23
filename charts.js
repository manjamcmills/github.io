function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").attr("class", "bold").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metaD = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSamples = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filterMeta = metaD.filter(metaObj => metaObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filterSamples[0];
     // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = filterMeta[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = firstSample.otu_ids;
    var otu_label = firstSample.otu_labels;
    var sample_value = firstSample.sample_values;
    console.log(sample_value);
    // 3. Create a variable that holds the washing frequency.
    var washFreq = firstMeta.wfreq;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_id.slice(0,10).map(x => "OTU " + x).reverse();
     

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_value.slice(0,10).reverse(),
      y: yticks,
      text: otu_label.slice(0,10).reverse(),
      marker: {color: "green", opacity: 0.6},
      type: "bar",
      orientation: "h"
    };
      
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b>Top 10 Bacteria Cultures Found<b>", font: {color: "green", size: 22, family: "Heather, monospace"}},
             
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
    console.log(otu_label)
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: "markers",
      marker: {size: sample_value, color: otu_id, colorscale: "Jet"},
      hovertemplate: '<i>(</i> %{x}, %{y}<i>)</i>' + '<br>%{text}</br> + <extra></extra>',
      
    };

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: {text: "<b>Bacteria Cultures Per Sample</b>", font: {size: 40, color: "blue", family: "Arial"}},
    xaxis: {title:"OTU ID"},
    showlegend: false,
    font: {
      family: 'Julian',
      size: 20,
      color: "red"
    }
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
  
  // 4. Create the trace for the gauge chart.
  var gaugeData = {
    domain:{ x: [0, 1], y: [0, 1] },
    value: washFreq,
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: {range:[null, 10]},
      bar: {color: "black"},
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "lime"},
        {range: [8,10], color: "green"}
      ],
    },
    labels: ["0-2", "2-4", "4-6", "6-8", "8-10"],
    title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: {size: 18}}
  };
      
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = {
    width: 400,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
     
  };
  
  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  
  });
};