// Use D3 fetch to read the JSON file
//Read samples.json & Display the sample metadata
function getMetaData(sample) {
    d3.json("samples.json").then((data) => {
    
    //Read metadata from json
    let sampleData = data.metadata;
    
    //Filter metadata for the sample id selected by the user
    let sampleSet = sampleData.filter(obj => obj.id == sample);
    
    let sampleId = sampleSet[0];
    
    //Select drop down option
    let dropdownMenu = d3.select("#sample-metadata");
  
    dropdownMenu.html("");
  
    // Assign the value of the dropdown menu option to a variable
    Object.entries(sampleId).forEach(([key, value]) => {
      dropdownMenu.append("h6").append("b").text(`${key.toUpperCase()}: ${value}`);
    });

    //Adding the Gauge Chart from bonus.js
     buildGauge(sampleId.wfreq);

    });

  };

// Function to build horizontal bar graph and bubble graph

function buildPlots(sample){
    d3.json("samples.json").then((data) => {
        
        //Read samples from json
        let sampleData = data.samples;

        //Filter metadata for the sample id selected by the user
        let sampleSet = sampleData.filter(obj => obj.id == sample);
        let sampleId = sampleSet[0];
        
        //Declare variables for graphs
        let otu_ids = sampleId.otu_ids;
        let sample_values = sampleId.sample_values;
        let otu_labels = sampleId.otu_labels;

        // Bubble Chart

        //Set trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Rainbow",
                labels: otu_labels,
                type: 'scatter',
                opacity: 0.5
            }
          };
          
          let data1 = [trace1];
          
          let layout = {
            title: 'Bacteria Cultures per Sample',
            margin: {t:0 },
            hovermode: "closest",
            xaxis: { title: 'OTU ID' }
          };
          
        //Plot the bubbble graph
        Plotly.newPlot('bubble', data1, layout);

        //Horizontal bar chart
        
        //Set y labels
        let y_lab = otu_ids.splice(0, 10).reverse()
        y_lab = y_lab.map(i => 'OTU ' + i);
        
        //Set trace
        let trace2 = {
          type: 'bar',
          x: sample_values.splice(0,10).reverse(),
          y: y_lab,
          text: otu_labels.splice(0,10).reverse(),
          orientation: 'h'
          };

          let data2 = [trace2];

          let layout2 = {
              margin: {t:0 },
              xaxis: { title: 'Sample Values' }
            };
        
        //Plot horizontal bar 
        Plotly.newPlot('bar', data2, layout2);

    });
};

//Call functions to rebuild dashboard for selected samples  
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildPlots(newSample);
    getMetaData(newSample);
  }

//Create init function to build dashboard for first sample
function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;
      Object.entries(sampleNames).forEach((sample) => {
        selector
          .append("option")
          .text(sample[1])
          .property("value", sample[1]);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildPlots(firstSample);
      getMetaData(firstSample);
    });
  }

  //Call init function to build dashboard for first sample
  init();