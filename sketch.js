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
  video.size(windowWidth, windowHeight);
  video.hide(); //비디오 숨기기

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  //Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);

  angleMode(DEGREES);
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
function draw (){

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
      rotate(sin(frameCount/100))
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
    text("neutral:      " + nf(neutral*100,0, 0)+"%", x+textYSpace*4, textYSpace*5);
    text("happiness:  " + nf(happy*100,0, 0)+"%", x+textYSpace*4, textYSpace*6);
    text("anger:       " + nf(angry*100,0, 0)+"%", x+textYSpace*4, textYSpace*7);
    text("sad:          "+ nf(sad*100,0, 0)+"%", x+textYSpace*4, textYSpace*8);
    text("surprised:   " + nf(surprised*100,0, 0)+"%",  x+textYSpace*4, textYSpace*9);
    pop();
  }else{
    //1번째 줄
    const unit = windowWidth/6
    //1-1
    push();
    noStroke();
    fill(30,30,30);
    rect(0,0,unit,unit);
    fill(100,100,100);
    arc(unit/2,unit,unit,unit,180,0)
    pop();
    //1-2
    push();
    noStroke();
    translate(unit,0)
    fill(200,200,200);
    rect(0,0,unit,unit);
    pop();
    //1-3
    push();
    noStroke();
    translate(unit*2,0);
    fill(100,100,100);
    rect(0,0,unit,unit);
    fill(150,150,130);
    arc(0,unit,unit*2,unit*2,270,0);
    pop();
    //1-4
    push();
    noStroke();
    translate(unit*3,0);
    fill(150,150,150);
    rect(0,0,unit,unit);
    fill(30,30,30);
    arc(unit,unit/2,unit,unit,90,270);
    pop();
    //1-5
    push();
    noStroke();
    translate(unit*4,0);
    fill(100,100,100);
    rect(0,0,unit,unit);
    pop();
    //1-6
    push();
    noStroke();
    translate(unit*5,0);
    fill(200,200,200);
    rect(0,0,unit,unit);
    fill(150,150,130);
    arc(unit,0,unit*2,unit*2,90,180);
    pop();


    //2번째줄
    push();
    translate(0,unit);
      //2-1
      push();
      noStroke();
      fill(150,150,130);
      rect(0,0,unit,unit);
      fill(50,50,50);
      arc(unit,unit/2,unit,unit,90,270);
      pop();
      //2-2
      push();
      noStroke();
      translate(unit,0);
      fill(100,100,100);
      rect(0,0,unit,unit);
        push();
        fill(150,150,150);
        for(let i=0; i<unit; i+=10){
          rect(i,0,2,unit-i)
        }
        pop();
      pop();
      //2-3
      push();
      noStroke();
      translate(unit*2,0);
      fill(50,50,50);
      rect(0,0,unit,unit);
      fill(150,150,150);
      arc(unit,unit/2,unit,unit,90,270);
      pop();
      //2-4
      push();
      noStroke();
      translate(unit*3,0);
      fill(150,150,130);
      rect(0,0,unit,unit);
      fill(50,50,50);
      arc(0,unit/2,unit,unit,270,90);
      pop();
      //2-5
      push();
      noStroke();
      translate(unit*4,0);
      fill(30,30,30);
      rect(0,0,unit,unit);
      fill(100,100,100);
      arc(unit/2,unit,unit,unit,180,0)
      pop();
      //2-6
      push();
      noStroke();
      translate(unit*5,0);
      fill(150,150,130);
      rect(0,0,unit,unit);
      pop();
    pop();

    //3번째 줄
    push();
    translate(0,unit*2);
      //3-1
      push();
      noStroke();
      fill(100,100,100);
      rect(0,0,unit,unit);
      pop();
      //3-2
      push();
      noStroke();
      translate(unit,0);
      fill(50,50,50);
      rect(0,0,unit,unit);
      fill(200,200,200);
      ellipse(unit/2,unit/2,unit);
      pop();
      //3-3
      push();
      noStroke();
      translate(unit*2,0);
      fill(100,100,100);
      rect(0,0,unit,unit);
      pop();
      //3-4
      push();
      noStroke();
      translate(unit*3,0);
      fill(200,200,200);
      rect(0,0,unit,unit);
      fill(70,70,70);
      arc(unit,unit,unit*2,unit*2,180,270);
      pop();
      //3-5
      push();
      noStroke();
      translate(unit*4,0);
      fill(200,200,200);
      rect(0,0,unit,unit);
      fill(150,150,130);
      arc(unit/2,unit,unit,unit,180,0);
      pop();
      //3-6
      push();
      noStroke();
      translate(unit*5,0);
      fill(100,100,100);
      rect(0,0,unit,unit);
      fill(30,30,30);
      arc(0,0,unit,unit,0,90);
      arc(0,unit,unit,unit,270,0);
      arc(unit,0,unit,unit,90,180);
      arc(unit,unit,unit,unit,180,270);
      pop();
    pop();

    //4번째줄
    push();
    translate(0,unit*3);
      //4-1
      push();
      noStroke();
      fill(30,30,30);
      rect(0,0,unit,unit);
      fill(150,150,130);
      arc(0,unit/2,unit,unit,270,90);
      pop();
      //4-2
      push();
      noStroke();
      translate(unit,0);
      fill(150,150,150);
      rect(0,0,unit,unit);
      pop();
      //4-3
      push();
      noStroke();
      translate(unit*2,0);
      fill(200,200,200);
      rect(0,0,unit,unit);
      fill(150,150,130);
      arc(unit/2,unit,unit,unit,180,0)
      pop();
      //4-4
      push();
      noStroke();
      translate(unit*3,0);
      fill(30,30,30);
      rect(0,0,unit,unit);
      push();
      fill(150,150,150);
      for(let i=0; i<unit; i+=10){
        rect(i,0,2,i)
      }
      pop();
      pop();
      //4-5
      push();
      noStroke();
      translate(unit*4,0);
      fill(150,150,150);
      rect(0,0,unit,unit);
      fill(50,50,50);
      arc(unit/2,0,unit,unit,0,180);
      pop();
      //4-6
      push();
      noStroke();
      translate(unit*5,0);
      fill(100,100,100);
      rect(0,0,unit,unit);
      pop();
    pop();

    push();
    textSize(15);
    noStroke();
    fill(245,184,65);
    text("neutral:      "+"0.%", x+textYSpace*2, textYSpace*2);
    text("happiness:  "+"0.%", x+textYSpace*2, textYSpace*3);
    text("anger:       "+"0.%", x+textYSpace*2, textYSpace*4);
    text("sad:          "+"0.%", x+textYSpace*2, textYSpace*5);
    text("surprised:   "+"0.%",  x+textYSpace*2, textYSpace*6);
    pop();
  }
}


function anim_ellipses(반지름) {
  let r = sin(frameCount/30)*20
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