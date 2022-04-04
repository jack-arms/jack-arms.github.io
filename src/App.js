import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState, useRef } from "react";

const WIDTH = 225;
const HEIGHT = 119;
// const SCALE = 20;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="https://www.reddit.com/r/AmericanFlaginPlace">
          r/AmericanFlaginPlace
        </a>
      </header>
      <Canvas />
    </div>
  );
}

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [selectedX, setSelectedX] = useState(null);
  const [selectedY, setSelectedY] = useState(null);
  const contextRef = useRef(null);
  const [scale, setScale] = useState(10);
  useEffect(() => {
    setSelectedX(null);
    setSelectedY(null);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    //Our first draw
    const image = new Image();
    image.src = "/vnbfjhkvfnjvsv.png";
    image.onload = () => {
      context.drawImage(image, 0, 0, WIDTH * scale, HEIGHT * scale);
    };
  }, [scale]);
  return (
    <div
      style={{
        position: "relative",
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          marginLeft: -8,
        }}
      >
        {[20, 10, 5, 1].map((x) => (
          <ScaleSelector
            key={x}
            isSelected={scale === x}
            onSelect={() => setScale(x)}
            scale={x}
          />
        ))}
      </div>
      <PixelHighlight
        context={contextRef.current}
        selectedX={selectedX}
        selectedY={selectedY}
        scale={scale}
      />
      <canvas
        height={HEIGHT * scale}
        width={WIDTH * scale}
        ref={canvasRef}
        onClick={(event) => {
          console.log({
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            screenX: event.screenX,
            screenY: event.screenY,
            targetLeft: event.currentTarget.getBoundingClientRect().left,
            targetTop: event.currentTarget.getBoundingClientRect().top,
          });
          const x =
            event.clientX - event.currentTarget.getBoundingClientRect().left;
          const y =
            event.clientY - event.currentTarget.getBoundingClientRect().top;
          console.log({ x, y });

          const pixelX = Math.floor(x / scale);
          const pixelY = Math.floor(y / scale);

          console.log({ pixelX, pixelY });

          setSelectedX(pixelX);
          setSelectedY(pixelY);
        }}
        {...props}
      />
    </div>
  );
};

const PixelHighlight = ({ selectedX, selectedY, context, scale }) => {
  if (selectedX == null || selectedY == null) {
    return null;
  }

  const color = context.getImageData(
    selectedX * scale,
    selectedY * scale,
    1,
    1
  ).data;

  const bestColor = nearestColor([color[0], color[1], color[2]]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundColor: "white",
          position: "absolute",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0px 0px 5px black",
          left: selectedX * scale + 2 * scale,
          top: selectedY * scale - scale,
        }}
      >
        This should be painted <strong>{bestColor.name}</strong>. Go to{" "}
        <a
          style={{}}
          target="_blank"
          href={`https://reddit.com/r/place/?cx=${1774 + selectedX}&cy=${
            1750 + selectedY
          }`}
        >
          {`https://reddit.com/r/place/?cx=${1774 + selectedX}&cy=${
            1750 + selectedY
          }`}
        </a>
        . (Click "Place a tile", twice if needed, until color selector comes up.
        Be careful not to click somewhere else or you'll lose the pixel.)
      </div>
      <div
        style={{
          borderWidth: 2,
          boxSizing: "border-box",
          borderColor: "#000",
          borderStyle: "solid",
          position: "absolute",
          left: selectedX * scale,
          top: selectedY * scale,
          width: scale,
          height: scale,
        }}
      />
    </div>
  );
};

const COLORS = [
  { color: "rgb(109, 0, 26)", name: "burgundy" },
  { color: "rgb(190, 0, 57)", name: "dark red" },
  { color: "rgb(255, 69, 0)", name: "red" },
  { color: "rgb(255, 168, 0)", name: "orange" },
  { color: "rgb(255, 214, 53)", name: "yellow" },
  { color: "rgb(255, 248, 184)", name: "pale yellow" },
  { color: "rgb(0, 163, 104)", name: "dark green" },
  { color: "rgb(0, 204, 120)", name: "green" },
  { color: "rgb(126, 237, 86)", name: "light green" },
  { color: "rgb(0, 117, 111)", name: "dark teal" },
  { color: "rgb(0, 158, 170)", name: "teal" },
  { color: "rgb(0, 204, 192)", name: "light teal" },
  { color: "rgb(36, 80, 164)", name: "dark blue" },
  { color: "rgb(54, 144, 234)", name: "blue" },
  { color: "rgb(81, 233, 244)", name: "light blue" },
  { color: "rgb(73, 58, 193)", name: "indigo" },
  { color: "rgb(106, 92, 255)", name: "periwinkle" },
  { color: "rgb(148, 179, 255)", name: "lavender" },
  { color: "rgb(129, 30, 159)", name: "dark purple" },
  { color: "rgb(180, 74, 192)", name: "purple" },
  { color: "rgb(228, 171, 255)", name: "pale purple" },
  { color: "rgb(222, 16, 127)", name: "magenta" },
  { color: "rgb(255, 56, 129)", name: "pink" },
  { color: "rgb(255, 153, 170)", name: "light pink" },
  { color: "rgb(109, 72, 47)", name: "dark brown" },
  { color: "rgb(156, 105, 38)", name: "brown" },
  { color: "rgb(255, 180, 112)", name: "beige" },
  { color: "rgb(0, 0, 0)", name: "black" },
  { color: "rgb(81, 82, 82)", name: "dark gray" },
  { color: "rgb(137, 141, 144)", name: "gray" },
  { color: "rgb(212, 215, 217)", name: "light gray" },
  { color: "rgb(255, 255, 255)", name: "white" },
];

function parseRGB(hex) {
  var result = /^rgb\((\d+), (\d+), (\d+)\)$/i.exec(hex);
  return result ? [result[1], result[2], result[3]] : null;
}

// Distance between 2 colors (in RGB)
// https://stackoverflow.com/questions/23990802/find-nearest-color-from-a-colors-list
function distance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
      Math.pow(a[1] - b[1], 2) +
      Math.pow(a[2] - b[2], 2)
  );
}

// return nearest color from array
function nearestColor(colorArray) {
  var lowest = Number.POSITIVE_INFINITY;
  var tmp;
  let index = 0;
  COLORS.forEach((el, i) => {
    tmp = distance(colorArray, parseRGB(el.color));
    if (tmp < lowest) {
      lowest = tmp;
      index = i;
    }
  });
  return COLORS[index];
}

const ScaleSelector = ({ scale, onSelect, isSelected }) => {
  console.log(scale);
  console.log(isSelected);
  return (
    <div
      style={{
        margin: 8,
        border: "1px solid black",
        padding: 16,
        backgroundColor: isSelected ? "red" : undefined,
        opacity: isSelected ? 0.8 : undefined,
      }}
      onClick={() => onSelect()}
    >
      <strong>{scale}x</strong>
    </div>
  );
};

export default App;
