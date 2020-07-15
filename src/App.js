import React from 'react';
import './App.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import capture from './img/bg_riadiati_v0.png';

function logTheQuestion(){
  var numQuizz = document.querySelector("#myinput_numQuizz").value;
  var equation = document.querySelector("#equation").value;
  var answer1 = document.querySelector("#answer1").value;
  var answer2 = document.querySelector("#answer2").value;
  var answer3 = document.querySelector("#answer3").value;
  var answer4 = document.querySelector("#answer4").value;

  var data = '\t\t{\r\n\t\t\t\t"id":"'+numQuizz+'",\r\n';
  data = data + '\t\t\t\t"correct":"",\r\n';
  data = data + '\t\t\t\t"question":"'+equation+'",\r\n';
  data = data + '\t\t\t\t"answer1":"'+answer1+'",\r\n';
  data = data + '\t\t\t\t"answer2":"'+answer2+'",\r\n';
  data = data + '\t\t\t\t"answer3":"'+answer3+'",\r\n';
  data = data + '\t\t\t\t"answer4":"'+answer4+'",\r\n';
  data = data + '\t\t\t\t"questionFontSize":0,\r\n';
  data = data + '\t\t\t\t"answerFontSize":0\r\n\t\t},\r\n';
  console.log(data);
}

function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
  if (pasteEvent.clipboardData == false) {
    if (typeof (callback) == "function") {
      callback(undefined);
    }
  };

  var items = pasteEvent.clipboardData.items;

  if (items == undefined) {
    if (typeof (callback) == "function") {
      callback(undefined);
    }
  };

  for (var i = 0; i < items.length; i++) {
    // Skip content if not image
    if (items[i].type.indexOf("image") == -1) continue;
    // Retrieve image on clipboard as blob
    var blob = items[i].getAsFile();

    if (typeof (callback) == "function") {
      callback(blob);
    }
  }
}

window.addEventListener("paste", function (e) {

  // Handle the event
  retrieveImageFromClipboardAsBlob(e, function (imageBlob) {
    var numQuizz = document.querySelector("#myinput_numQuizz").value;
    logTheQuestion();

    // If there's an image, display it in the canvas
    if (imageBlob) {
      var canvas = document.getElementById("theCanvas");
      var ctx = canvas.getContext('2d');

      // Create an image to render the blob on the canvas
      var img = new Image();

      // Once the image loads, render the img on the canvas
      img.onload = function () {
        // Update dimensions of the canvas with the dimensions of the image
        canvas.width = this.width;
        canvas.height = this.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        var newCanvas = document.getElementById("myCanvas");
        var newCtx = newCanvas.getContext("2d");
        newCtx.drawImage(img, -952, -113);

        let uri = newCanvas.toDataURL();
        // console.log(newCanvas.toDataURL());
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          link.href = uri;
          link.download = numQuizz + '.png';
          //Firefox requires the link to be in the body
          document.body.appendChild(link);
          //simulate click
          link.click();
          //remove the link when done
          document.body.removeChild(link);
        } else {
          window.open(uri);
        }
      };

      // Crossbrowser support for URL
      var URLObj = window.URL || window.webkitURL;

      // Creates a DOMString containing a URL representing the object given in the parameter
      // namely the original Blob
      img.src = URLObj.createObjectURL(imageBlob);

    }
  });
}, false);

function MyInput(props) {
  return (
    <div className="form-group col-sm-12">
      <div className="col-sm-2 div-inline">
        <label className="control-label" forhtml={props.id}>{props.label} : </label>
      </div>
      <div className="col-sm-10 div-inline">
        <input type={props.type} className="form-control" id={props.id} placeholder={props.placeholder}
          onChange={props.onChange} />
      </div>
    </div>
  )
}

function MyTextArea(props) {
  return (
    <div className="form-group col-sm-12">
      <div className="col-sm-2 div-inline" style={props.labelStyle}>
        <label className="control-label" forhtml={props.id}>{props.label} : </label>
      </div>
      <div className="col-sm-10 div-inline">
        <textarea className="form-control"
          id={props.id}
          title={props.title}
          onChange={props.onChange}
          rows={props.rows}
          cols={props.cols}>
        </textarea>
      </div>
    </div>
  )
}

function MySelect(props) {
  return (
    <div className="form-group col-sm-12">
      <div className="col-sm-2 div-inline" style={props.labelStyle}>
        <label className="control-label" >{props.label} : </label>
      </div>
      <div className="col-sm-10 div-inline">
        <select className="form-control" value={props.value} onChange={props.onChange}>
          <option value="tiny">(5pt) Très petit</option>
          <option value="small">(9pt) Petit</option>
          <option value="">(10pt) Normal</option>
          <option value="large">(12pt) Grand</option>
          <option value="LARGE">(18pt) Grand</option>
          <option value="huge">(20pt) Énorme</option>
        </select>
      </div>
    </div>
  )
}

function MySlider(props) {
  return (
    <div className="form-group col-sm-12">
      <div className="col-sm-2 div-inline">
        <label className="control-label" >{props.label} : </label>
      </div>
      <div className="col-sm-9 div-inline">
        <RangeSlider
          value={props.value}
          onChange={props.onChange}
          min={props.min}
          max={props.max}
        />
      </div>
      <div className="col-sm-1 div-inline">
        <label className="control-label" >{props.value}</label>
      </div>
    </div>
  )
}

function MyButton(props) {
  return (
    <div className="form-group col-sm-12">
      <div className="col-sm-2 div-inline"></div>
      <div className="col-sm-10 div-inline">
        <button id="callServlet" type="button" className="btn btn-success" onClick={props.onClick} >{props.value}</button>
      </div>
      {/* onClick="screenCapture()" */}
    </div>
  )
}

function MyLatex(props) {
  return (
    <div id={props.id} className={props.cssClass}>
      {/* <img src="http://latex.codecogs.com/png.latex?%5Cdpi%7B95%7D%20%5Clarge%201%2B5!-4!-3!-2!-1! %3D ? " /> */}
      <img id={props.image_id} src={props.url} />
    </div>
  )
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formula_url: "",
      formula: "1234",
      dpi: 95,
      size: "",
      numQuizz: "",
      answer1: "",
      answer1_url: "",
      answer2: "",
      answer2_url: "",
      answer3: "",
      answer3_url: "",
      answer4: "",
      answer4_url: "",
    };

    this.handleOnChangeFormula = this.handleOnChangeFormula.bind(this);
    this.handleOnChangeDPI = this.handleOnChangeDPI.bind(this);
    this.handleOnChangeSize = this.handleOnChangeSize.bind(this);
  }

  renderMyInput(id, label, type, placeholder, onChange) {
    return (
      <MyInput id={id} label={label} type={type} placeholder={placeholder} onChange={onChange} />
    )
  }

  renderMyTextArea(id, label, title, rows, cols, onChange) {
    return (
      <MyTextArea id={id} label={label} title={title} onChange={onChange} rows={rows} cols={cols} />
    )
  }

  // <MyLatex id="formula" url={this.state.formula_url} />
  renderMyLatex(id, url, cssClass, image_id) {
    // console.log("renderMyLatex passed !! ")
    return (
      <MyLatex id={id} url={url} cssClass={cssClass} image_id={image_id} />
    )
  }

  handleOnChangeFormula(formula) {
    // console.log("onChangeFormula passed !! ")
    this.setState({
      formula: formula,
      formula_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + formula,
      answer1_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer1,
      answer2_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer2,
      answer3_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer3,
      answer4_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer4,
    })
  }

  handleOnChangeDPI(dpi) {
    dpi = Number(dpi);
    if (dpi < 65) {
      dpi = 50;
    } else if (dpi < 90) {
      dpi = 80;
    } else if (dpi < 105) {
      dpi = 100;
    } else if (dpi < 115) {
      dpi = 110;
    } else if (dpi < 135) {
      dpi = 120;
    } else if (dpi < 175) {
      dpi = 150;
    } else if (dpi < 250) {
      dpi = 200;
    } else {
      dpi = 300;
    }
    // console.log("setDPI passed !!");
    this.setState({
      dpi: dpi,
      formula_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.formula,
      answer1_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer1,
      answer2_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer2,
      answer3_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer3,
      answer4_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + dpi + "%7D%20%5C" + this.state.size + "%20" + this.state.answer4,
    })
  }

  handleOnChangeSize(size) {
    // console.log("handleMsSelectChange passed !!");
    this.setState({
      size: size,
      formula_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + size + "%20" + this.state.formula,
      answer1_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + size + "%20" + this.state.answer1,
      answer2_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + size + "%20" + this.state.answer2,
      answer3_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + size + "%20" + this.state.answer3,
      answer4_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + size + "%20" + this.state.answer4,
    })
  }

  handleOnChangeNumQuizz(value) {
    // console.log("handleOnChangeNumQuizz passed !!");
    this.setState({
      numQuizz: value,
    })
  }

  handleOnChangeAnswer1(answer1) {
    // console.log("handleOnChangeAnswer1 passed !!");
    this.setState({
      answer1: answer1,
      answer1_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + answer1,
    })
  }

  handleOnChangeAnswer2(answer2) {
    // console.log("handleOnChangeAnswer2 passed !!");
    this.setState({
      answer2: answer2,
      answer2_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + answer2,
    })
  }

  handleOnChangeAnswer3(answer3) {
    // console.log("handleOnChangeAnswer3 passed !!");
    this.setState({
      answer3: answer3,
      answer3_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + answer3,
    })
  }

  handleOnChangeAnswer4(answer4) {
    // console.log("handleOnChangeAnswer4 passed !!");
    this.setState({
      answer4: answer4,
      answer4_url: "https://latex.codecogs.com/png.latex?%5Cdpi%7B" + this.state.dpi + "%7D%20%5C" + this.state.size + "%20" + answer4,
    })
  }

  render() {

    const myTextAreaLabelStyle = {
      verticalAlign: "top",
    }
    const h2cssStyle = {
      padding: "11px",
      textAlign: "center",
    }

    return (
      <div>
        <div id="div_container_left" className="container">
          <h2 style={h2cssStyle}>My MATH Quizz Generator v0.1</h2>

          <form className="form-horizontal" action="/action_page.php">

            {/* {this.renderMyInput("numQuizz", "N. Quizz", "text", "Enter Quizz Number", )} */}

            <MyInput id="myinput_numQuizz" label="N. Quizz" type="text" placeholder="Enter Quizz Number"
              onChange={(event) => this.handleOnChangeNumQuizz(event.target.value)}
            />

            <MySlider label="DPI" value={this.state.dpi} min={Number("50")} max={Number("300")}
              onChange={(event) => this.handleOnChangeDPI(event.target.value)}
            />

            <MySelect value={this.state.size} onChange={(event) => this.handleOnChangeSize(event.target.value)} label="Police size" />

            <MyTextArea id="equation" label="Equation" title="Equation" rows="4" cols="50" labelStyle={myTextAreaLabelStyle}
              onChange={(event) => this.handleOnChangeFormula(event.target.value)}
            />

            <MyInput id="answer1" label="Answer 1" type="text" placeholder="Enter the 1st choice "
              onChange={(event) => this.handleOnChangeAnswer1(event.target.value)} />
            <MyInput id="answer2" label="Answer 2" type="text" placeholder="Enter the 2nd choice "
              onChange={(event) => this.handleOnChangeAnswer2(event.target.value)} />
            <MyInput id="answer3" label="Answer 3" type="text" placeholder="Enter the 3rd choice "
              onChange={(event) => this.handleOnChangeAnswer3(event.target.value)} />
            <MyInput id="answer4" label="Answer 4" type="text" placeholder="Enter the 4th choice "
              onChange={(event) => this.handleOnChangeAnswer4(event.target.value)} />

            {/* <MyButton onClick={(event) => this.handleOnClickResizeButton(this.state.numQuizz)} value="Resize" /> */}

            <div><span>(*) Print screen AND Ctrl + V</span></div>
          </form>
        </div>
        <div id="div_container_right">
          <div id="numQuizz">
            {this.state.numQuizz}
          </div>
          {this.renderMyLatex("formula", this.state.formula_url, "latex", "img_formula")}

          <div id="div_answers_bloc_1" className="answer_bloc">
            {this.renderMyLatex("answer1", this.state.answer1_url, "latex answer_result", "img_answer1")}
            {this.renderMyLatex("answer2", this.state.answer2_url, "latex answer_result", "img_answer2")}
          </div>
          <div id="div_answers_bloc_2" className="answer_bloc">
            {this.renderMyLatex("answer3", this.state.answer3_url, "latex answer_result", "img_answer3")}
            {this.renderMyLatex("answer4", this.state.answer4_url, "latex answer_result", "img_answer4")}
          </div>
        </div>
        <canvas id="myCanvas" width="710" height="600" />
        <canvas id="theCanvas" style={{ display: "none", }} />

        <img id="capture" src={capture} alt="The Scream" />
      </div >
    );
  }
}

export default App;
