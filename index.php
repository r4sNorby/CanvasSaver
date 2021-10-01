<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <link rel="stylesheet" href="style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </head>
    <body>
        <div>
            <div>
                <h2>Rectangle:</h2>
                <label>X</label>
                <input type="number" id="rx" value="0">
                <label>Y</label>
                <input type="number" id="ry" value="0">
                <label>Width</label>
                <input type="number" id="width" value="80">
                <label>Height</label>
                <input type="number" id="height" value="80">
            </div>
            <div>
                <h2>Circle:</h2>
                <label>X</label>
                <input type="number" id="cx" value="40">
                <label>Y</label>
                <input type="number" id="cy" value="40">
                <label>Radius</label>
                <input type="number" id="radius" value="40">
            </div>
            <button onclick="makeRectangle()">Draw rectangle</button>
            <button onclick="makeCircle()">Draw circle</button>
            <button onclick="makeCircle()">Draw table</button>
            <button onclick="loadCanvas(1)">Load square</button>
            <button onclick="loadCanvas(2)">Load circle</button>
            <button onclick="saveCanvas(shape)">Save canvas</button>
            <button onclick="reset()">Reset</button>
        </div>
        <canvas id="myCanvas" width="300" height="300"></canvas>
        <svg width='200' height='200'>
             <foreignObject width='100%' height='100%'>
               <div>
                  <table border='1'><tr><td>row 1, cell 1</td><td>row 1, cell 2</td></tr><tr><td>row 2, cell 1</td><td>row 2, cell 2</td></tr></table>
               </div>
             </foreignObject>
           </svg>
        <script src="testFunctions.js"></script>
        <div id="tableContainer">
            <div>
                <h2>Rectangles</h2>
                <table id="tableRectangles">
                    <tr>
                        <th>ID</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Width</th>
                        <th>Height</th>
                        <th>Z-Index</th>
                    </tr>
                </table>
            </div>
            <div>
                <h2>Circles</h2>
                <table id="tableCircles">
                    <tr>
                        <th>ID</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Radius</th>
                        <th>Z-Index</th>
                    </tr>
                </table>
            </div>
            <div>
                <h2>Circles</h2>
                <table id="tableText">
                    <tr>
                        <th>ID</th>
                        <th>Text</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Radius</th>
                        <th>Z-Index</th>
                    </tr>
                </table>
            </div>
        </div>
    </body>
</html>