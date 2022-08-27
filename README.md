# ConwayJavascript
 
Just a simple implimentation of Conway's Game of Life in Javascript.

It is not array based in the traditional sense, instead it is object based. Every cell around every living cell and every living cell themselves are evaluated to create the next frame. This means you're not limited to evaluating in the fixed predetermined size of a two dimentional array. The coordinate system will even extend into negative values.