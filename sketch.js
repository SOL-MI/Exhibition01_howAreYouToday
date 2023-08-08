let faceapi;
let detections = [];
let video;
let canvas;
const NOW_DATE = new Date();

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");

  video = createCapture(VIDEO);// Create the video
  video.id("video");
  video.size(width, height);
  video.hide(); //비디오 숨기기

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  //Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);

}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces
}

// Got faces
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;　//Now all the data in this detections
  //console.log(detections);

  clear();//Draw transparent background;
  drawBoxs(detections);//Draw detection box
  drawLandmarks(detections);//// Draw all the face points
  drawExpressions(detections, 20, 20, 14);//Draw face expression

  faceapi.detect(gotFaces);// Call the function again at here
}

//얼굴 네모 박스 그리기
function drawBoxs(detections){
  if (detections.length > 0) {//If at least 1 face is detected
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      //stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

//얼굴 점 표시 그리기
function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        // stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected
    //let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions; <-기존코드.
    //console.log(detections[0].expressions.neutral) <- 값 제대로 나오나 테스트용
    let {neutral, happy, angry, sad, surprised} = detections[0].expressions;
    
    push();
      fill(neutral*200,255,100);
      noStroke();
      translate(0,neutral*10);
      rect(0,0,50,50);
    pop();

    push();
      translate(100,300)
      rotate(sin(frameCount/20))
      fill(neutral*200,255,100)
      anim_ellipses(75)
	  pop();

    push()
    fill(255,0,0);
    noStroke();
    for(let i=0; i<10; i++){
      rect(i*10,0,5,100-i*i*2)
    }
    pop()
    
    //글자
    push();
    textSize(14);
    noStroke();
    fill(255, 169, 225);
    text("neutral:      " + nf(neutral*100,0, 0)+"%", x+textYSpace*5, textYSpace*5);
    text("happiness:  " + nf(happy*100,0, 0)+"%", x+textYSpace*5, textYSpace*6);
    text("anger:       " + nf(angry*100,0, 0)+"%", x+textYSpace*5, textYSpace*7);
    text("sad:          "+ nf(sad*100,0, 0)+"%", x+textYSpace*5, textYSpace*8);
    text("surprised:   " + nf(surprised*100,0, 0)+"%",  x+textYSpace*5, textYSpace*9);
    pop();
  }else{
    //1번째 줄
    push();
    noStroke();
    fill(100,100,100);
    rect(0,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(255,100,100);
    rect(windowWidth/8,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(100,100,100);
    rect(windowWidth/4,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(255,100,100);
    rect(windowWidth/8*3,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(100,100,100);
    rect(windowWidth/2,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(255,100,100);
    rect(windowWidth/8*5,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(100,100,100);
    rect(windowWidth/4*3,0,windowWidth/8,windowWidth/8);
    pop();

    push();
    noStroke();
    fill(255,100,100);
    rect(windowWidth/8*7,0,windowWidth/8,windowWidth/8);
    pop();

    //2번째줄

    push();
    fill(255,0,0);
    noStroke();
    for(let i=0; i<10; i++){
      rect(i*10,0,5,100-i*i*2)
    }
    pop();

    push();
    textSize(14);
    noStroke();
    fill(255, 169, 225);
    text("neutral:      "+"0.%", x+textYSpace*5, textYSpace*5);
    text("happiness:  "+"0.%", x+textYSpace*5, textYSpace*6);
    text("anger:       "+"0.%", x+textYSpace*5, textYSpace*7);
    text("sad:          "+"0.%", x+textYSpace*5, textYSpace*8);
    text("surprised:   "+"0.%",  x+textYSpace*5, textYSpace*9);
    pop();
  }
}

//잉여 코드. 어느 정도 작업 진행되면 지워도됨.
// function draw(){
  // clear();//Draw transparent background
  // image(video, 0, 0, width, height);
// }

//A라는 함수 만들어서 여기다가 그림 그리고 똑같이 dectections인수로 받아서 감정 값 가져올랬는데 잘안됨.
// function A(detections){
//   fill(0, 169, 225);
//   rect(100,100,100,200);
//   if(detections.length > 0){
//     let {neutral1, happy1, angry1, sad1, surprised1} = detections[0].expressions;
//     console.log(neutral1)
//     if(neutral1>50){
//       rect(300,200,50,50);
//     }
//   }
// }

function anim_ellipses(반지름) {
  let r = sin(frameCount/5)*20
  push()
  noStroke()
  // fill("#2ec4b6")

  push()
  translate(-반지름/2, -반지름/2)
  rotate(-45)
  ellipse(0, 0, 반지름/2 + r, 반지름 - Math.abs(r) )
  pop()

  push()
  translate(반지름/2, -반지름/2)
  rotate(45)
  ellipse(0, 0, 반지름/2 + r, 반지름 - Math.abs(r) )
  pop()

  push()
  translate(-반지름/2, 반지름/2)
  rotate(45)
  ellipse(0, 0, 반지름/2 + r, 반지름 - Math.abs(r) )
  pop()

  push()
  translate(반지름/2, 반지름/2)
  rotate(-45)
  ellipse(0, 0, 반지름/2 + r, 반지름 - Math.abs(r) )
  pop()
pop()
}