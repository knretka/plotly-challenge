function getMetaData(sample) {
    d3.json("samples.json").then((data) => {
    
    var sampleData = data.metadata;
    
    var sampleSet = sampleData.filter(obj => obj.id == sample);
    
    var sampleId = sampleSet[0];
    
    var dropdownMenu = d3.select("#sample-metadata");
  
    dropdownMenu.html("");
  
    Object.entries(sampleId).forEach(([key, value]) => {
      dropdownMenu.append("h6").append("b").text(`${key.toUpperCase()}: ${value}`);
    });

    });

  };


function buildPlot(sample){
    d3.json("samples.json").then((data) => {
        
        var sampleData = data.samples;

        var sampleSet = sampleData.filter(obj => obj.id == sample);
        var sampleId = sampleSet[0];
        
        var otu_ids = sampleId.otu_ids;
        var sample_values = sampleId.sample_values;
        var otu_labels = sampleId.otu_labels;

//Bubble Chart
        var trace1 = {
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
                opacity: 0.7
            }
          };
          
          var data1 = [trace1];
          
          var layout = {
            title: 'Bacteria Cultures per Sample',
            margin: {t:0 },
            hovermode: "closest",
            xaxis: { title: 'OTU ID' }
          };
          
        Plotly.newPlot('bubble', data1, layout);

 //Bar Chart       
        var y_lab = otu_ids.splice(0, 10).reverse()
        y_lab = y_lab.map(i => 'OTU ' + i);
        
        var trace2 = {
          type: 'bar',
          x: sample_values.splice(0,10).reverse(),
          y: y_lab,
          text: otu_labels.splice(0,10).reverse(),
          orientation: 'h'
          };

          var data2 = [trace2];

          var layout2 = {
              margin: {t:0 },
              xaxis: { title: 'Sample Values' }
            };
        
        Plotly.newPlot('bar', data2, layout2);

    });
};

function optionChanged(newSample) {
    (newSample);
    getMetaData(newSample);
  }

function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
      Object.entries(sampleNames).forEach((sample) => {
        selector
          .append("option")
          .text(sample[1])
          .property("value", sample[1]);
      });
  
      const firstSample = sampleNames[0];
      (firstSample);
      getMetaData(firstSample);
    });
  }

  init();