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

  frameRate(24);
  
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
    //for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[0].alignedRect._box;
      //stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    //}
  }
}

//얼굴 점 표시 그리기
function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected
   // for (f=0; f < detections.length; f++){
      let points = detections[0].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        // stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
   // }
  }
}
function draw (){

}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected
    //let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions; <-기존코드.
    //console.log(detections[0].expressions.neutral) <- 값 제대로 나오나 테스트용
    let {neutral, happy, angry, sad, surprised} = detections[0].expressions;
    let newSurprised = map(surprised,0,1,0,windowWidth);  
    
    basicbg();

    if(sad>0.25){
      sadColorBg (sad);
    }

    InteractionDisplay(neutral, happy, angry, sad, surprised);
    

    surprisedColor (newSurprised);

    // push();
    //   translate(100,300);
    //   fill(neutral*200,255,100);
    //   anim_ellipses(75);
	  // pop();

    //글자
    push();
    textSize(14);
    noStroke();
    fill(245,184,65);
    text("neutral:      " + nf(neutral*100,0, 0)+"%", x+textYSpace*2, textYSpace*3);
    text("happiness:  " + nf(happy*100,0, 0)+"%", x+textYSpace*2, textYSpace*4);
    text("anger:       " + nf(angry*100,0, 0)+"%", x+textYSpace*2, textYSpace*5);
    text("sad:          "+ nf(sad*100,0, 0)+"%", x+textYSpace*2, textYSpace*6);
    text("surprised:   " + nf(surprised*100,0, 0)+"%",  x+textYSpace*2, textYSpace*7);
    pop();
  }else{
    basicbg();

    push();
    textSize(14);
    noStroke();
    fill(245,184,65);
    text("neutral:      "+"0.%", x+textYSpace*2, textYSpace*3);
    text("happiness:  "+"0.%", x+textYSpace*2, textYSpace*4);
    text("anger:       "+"0.%", x+textYSpace*2, textYSpace*5);
    text("sad:          "+"0.%", x+textYSpace*2, textYSpace*6);
    text("surprised:   "+"0.%",  x+textYSpace*2, textYSpace*7);
    pop();
  }
}

function InteractionDisplay(neutral, happy, angry, sad, surprised){
  //1번째 줄
  const unit = windowWidth/7;

  let happyOpacity = map(happy,0,1,0.9,1);
  let angryOpacity = map(angry,0,1,0.8,1);
  const happyOffset = 0.8;
  const angryOffset = 0.35;
  const sadOffset = 0.3;
  const surprisedOffset1 = 0.997;
  // const surprisedOffset2 = 0.2;
  let sadColorFrameCount = cos(frameCount/5)*2.4;
  console.log(sadColorFrameCount)
  const Section0 = 2;
  const Section1 = 1.7;
  const Section2 = 1; 
  const Section3 = 0.3;
  const Section4 = 0;
  const Section5 = -0.3;
  const Section6 = -1;
  const Section7 = -1.7;
  const Section8 = -2;

  //1-1
  push();
  noStroke();
  if(happy>happyOffset){
    fill(233,255,255,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(255,100,50,angryOpacity*255);
  }else if(sad>sadOffset&&(2.4>=sadColorFrameCount&&sadColorFrameCount>2.3)){
    fill(11,57,72);
  }
  rect(0,0,unit,unit);

  if(happy>happyOffset){
    fill(255,86,102,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(200,50,100,angryOpacity*255);
  }else if(sad>sadOffset&&(2.4>=sadColorFrameCount&&sadColorFrameCount>2.3)){
    fill(89,145,201);
  }
  arc(unit/2,unit,unit,unit,180,0);
  pop();
  //1-2
  push();
  noStroke();
  translate(unit,0);
  if(happy>happyOffset||surprised>surprisedOffset1){
    fill(143,235,150,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(253,16,35,angryOpacity*255);
  }else if(sad>sadOffset&&(1.72>=sadColorFrameCount&&sadColorFrameCount>1.55)){
    fill(11,57,72);
  }
  rect(0,0,unit,unit);
  pop();
  //1-3
  push();
  noStroke();
  translate(unit*2,0);
  if(happy>happyOffset){
    fill(255,86,102,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(200,50,100,angryOpacity*255);
  }else if(sad>sadOffset&&((1.04>=sadColorFrameCount&&sadColorFrameCount>0.87))){
    fill(89,145,201);
  }
  rect(0,0,unit,unit);
  if(happy>happyOffset){
    fill(255,236,0,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(255,100,50,angryOpacity*255);
  }else if(sad>sadOffset&&((1.04>=sadColorFrameCount&&sadColorFrameCount>0.87))){
    fill(142,185,255);
  }
  arc(0,unit,unit*2,unit*2,270,0);
  pop();
  //1-4
  push();
  noStroke();
  translate(unit*3,0);
  if(happy>happyOffset){
    fill(233,255,255,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(248,152,224,angryOpacity*255);
  }else if(sad>sadOffset&&((0.36>=sadColorFrameCount&&sadColorFrameCount>0.19))){
    fill(142,185,255);
  }
  rect(0,0,unit,unit);
  if(happy>happyOffset||surprised>surprisedOffset1){
    fill(0,221,75,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(255,100,50,angryOpacity*255);
  }else if(sad>sadOffset&&((0.36>=sadColorFrameCount&&sadColorFrameCount>0.19))){
    fill(11,57,72);
  }
  arc(unit,unit/2,unit,unit,90,270);
  pop();
  //1-5
  push();
  noStroke();
  translate(unit*4,0);
  if(happy>happyOffset){
    fill(255,236,0,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(200,50,100,angryOpacity*255);
  }else if(sad>sadOffset&&((-0.32>=sadColorFrameCount&&sadColorFrameCount>-0.49))){
    fill(89,145,201);
  }
  rect(0,0,unit,unit);
  pop();
  //1-6
  push();
  noStroke();
  translate(unit*5,0);
  if(happy>happyOffset){
    fill(233,255,255,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(253,16,35,angryOpacity*255);
  }else if(sad>sadOffset&&((-1.0>=sadColorFrameCount&&sadColorFrameCount>-1.17))){
    fill(89,145,201);
  }
  rect(0,0,unit,unit);
  if(happy>happyOffset){
    fill(255,86,102,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(248,152,224,angryOpacity*255);
  }else if(sad>sadOffset&&((-1.0>=sadColorFrameCount&&sadColorFrameCount>-1.17))){
    fill(142,185,255);
  }
  arc(unit,0,unit*2,unit*2,90,180);
  pop();
  //1-7
  push();
  noStroke();
  translate(unit*6,0);
  if(happy>happyOffset){
    fill(233,255,255,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(255,100,50,angryOpacity*255);
  }else if(sad>sadOffset&&(-1.70>=sadColorFrameCount&&sadColorFrameCount>-1.9)){
    fill(11,57,72);
  }
  rect(0,0,unit,unit);

  if(happy>happyOffset){
    fill(0,221,75,happyOpacity*255);
  }else if(angry>angryOffset){
    fill(200,50,100,angryOpacity*255);
  }else if(sad>sadOffset&&(-1.70>=sadColorFrameCount&&sadColorFrameCount>-1.9)){
    fill(89,145,201);
  }
  arc(unit/2,unit,unit,unit,180,0);
  pop();


  //2번째줄
  push();
  translate(0,unit);
    //2-1
    push();
    noStroke();
    // fill(150,150,130);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,236,0,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&(2.3>=sadColorFrameCount&&sadColorFrameCount>2.1)){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    // fill(50,50,50);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(143,235,150,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&(2.3>=sadColorFrameCount&&sadColorFrameCount>2.1)){
      fill(142,185,255);
    }
    arc(unit,unit/2,unit,unit,90,270);
    pop();
    //2-2
    push();
    noStroke();
    translate(unit,0);
    // fill(100,100,100);
    if(happy>happyOffset){
      fill(42,229,208,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(200,50,100,angryOpacity*255);
    }else if(sad>sadOffset&&(1.55>=sadColorFrameCount&&sadColorFrameCount>1.38)){
      fill(89,145,201);
    }
    rect(0,0,unit,unit);
      push();
      // fill(150,150,150);
      if(happy>happyOffset){
        fill(233,255,255,happyOpacity*255);
      }else if(angry>angryOffset){
        fill(255,150,100,angryOpacity*255);
      }else if(sad>sadOffset&&(1.55>=sadColorFrameCount&&sadColorFrameCount>1.38)){
      fill(112,105,150);
      }
      for(let i=0; i<unit; i+=10){
        rect(i,0,2,unit-i)
      }
      pop();
    pop();
    //2-3
    push();
    noStroke();
    translate(unit*2,0);
    // fill(50,50,50);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(233,255,255,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&((0.87>=sadColorFrameCount&&sadColorFrameCount>0.7))){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    // fill(150,150,150);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,50,35,angryOpacity*255);
    }else if(sad>sadOffset&&((0.87>=sadColorFrameCount&&sadColorFrameCount>0.7))){
      fill(89,145,201);
    }
    arc(unit,unit/2,unit,unit,90,270);
    pop();
    //2-4
    push();
    noStroke();
    translate(unit*3,0);
    // fill(150,150,130);
    if(happy>happyOffset){
      fill(42,229,208,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&((0.19>=sadColorFrameCount&&sadColorFrameCount>0.02))){
      fill(11,57,72);
    }
    rect(0,0,unit,unit);
    // fill(50,50,50);
    if(happy>happyOffset){
      fill(255,236,0,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,50,angryOpacity*255);
    }else if(sad>sadOffset&&((0.19>=sadColorFrameCount&&sadColorFrameCount>0.02))){
      fill(89,145,201);
    }
    arc(0,unit/2,unit,unit,270,90);
    pop();
    //2-5
    push();
    noStroke();
    translate(unit*4,0);
    // fill(30,30,30);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,50,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.49>=sadColorFrameCount&&sadColorFrameCount>-0.66))){
      fill(142,185,255);
    }
    rect(0,0,unit,unit);
    // fill(100,100,100);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(233,255,255,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.49>=sadColorFrameCount&&sadColorFrameCount>-0.66))){
      fill(112,105,150);
    }
    arc(unit/2,unit,unit,unit,180,0)
    pop();
    //2-6
    push();
    noStroke();
    translate(unit*5,0);
    // fill(150,150,130);
    if(happy>happyOffset){
      fill(143,235,150,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(200,50,100,angryOpacity*255);
    }else if(sad>sadOffset&&((-1.17>=sadColorFrameCount&&sadColorFrameCount>-1.34))){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    pop();
    //2-7
    push();
    noStroke();
    translate(unit*6,0);
    // fill(150,150,130);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,236,0,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&(-1.9>=sadColorFrameCount&&sadColorFrameCount>-2.10)){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    // fill(50,50,50);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(143,235,150,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&(-1.9>=sadColorFrameCount&&sadColorFrameCount>-2.10)){
      fill(142,185,255);
    }
    arc(unit,unit/2,unit,unit,90,270);
    pop();
  pop();

  //3번째 줄
  push();
  translate(0,unit*2);
    //3-1
    push();
    noStroke();
    // fill(100,100,100);
    if(happy>happyOffset){
      fill(233,255,255,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(200,50,100,angryOpacity*255);
    }else if(sad>sadOffset&&(2.1>=sadColorFrameCount&&sadColorFrameCount>1.9)){
      fill(11,57,72);
    }
    rect(0,0,unit,unit);
    pop();
    //3-2
    push();
    noStroke();
    translate(unit,0);
    // fill(50,50,50);
    if(happy>happyOffset){
      fill(0,221,75,happyOpacity*255);
    }else if(angry>angryOffset||surprised>surprisedOffset1){
      fill(255,150,100,angryOpacity*255);
    }else if(sad>sadOffset&&(1.38>=sadColorFrameCount&&sadColorFrameCount>1.21)){
      fill(11,57,72);
    }
    rect(0,0,unit,unit);
    // fill(200,200,200);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,236,0,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,100,angryOpacity*255);
    }else if(sad>sadOffset&&(1.38>=sadColorFrameCount&&sadColorFrameCount>1.21)){
      fill(112,105,150);
    }
    ellipse(unit/2,unit/2,unit);
    pop();
    //3-3
    push();
    noStroke();
    translate(unit*2,0);
    // fill(100,100,100);
    if(happy>happyOffset){
      fill(143,235,150,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&((0.7>=sadColorFrameCount&&sadColorFrameCount>0.53))){
      fill(89,145,201);
    }
    rect(0,0,unit,unit);
    pop();
    //3-4
    push();
    noStroke();
    translate(unit*3,0);
    // fill(200,200,200);
    if(happy>happyOffset){
      fill(0,221,75,happyOpacity*255);
    }else if(angry>angryOffset||surprised>surprisedOffset1){
      fill(255,100,50,angryOpacity*255);
    }else if(sad>sadOffset&&((0.02>=sadColorFrameCount&&sadColorFrameCount>-0.15))){
      fill(11,57,72);
    }
    rect(0,0,unit,unit);
    // fill(70,70,70);
    if(happy>happyOffset){
      fill(233,255,255,happyOpacity*255);
    }else if(angry>angryOffset||surprised>surprisedOffset1){
      fill(200,50,100,angryOpacity*255);
    }else if(sad>sadOffset&&((0.02>=sadColorFrameCount&&sadColorFrameCount>-0.15))){
      fill(142,185,255);
    }
    arc(unit,unit,unit*2,unit*2,180,270);
    pop();
    //3-5
    push();
    noStroke();
    translate(unit*4,0);
    // fill(200,200,200);
    if(happy>happyOffset){
      fill(42,229,208,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.66>=sadColorFrameCount&&sadColorFrameCount>-0.83))){
      fill(142,185,255);
    }
    rect(0,0,unit,unit);
    // fill(150,150,130);
    if(happy>happyOffset){
      fill(255,236,0,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,150,100,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.66>=sadColorFrameCount&&sadColorFrameCount>-0.83))){
      fill(112,105,150);
    }
    arc(unit/2,unit,unit,unit,180,0);
    pop();
    //3-6
    push();
    noStroke();
    translate(unit*5,0);
    // fill(100,100,100);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(0,221,75,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&((-1.34>=sadColorFrameCount&&sadColorFrameCount>-1.51))){
      fill(142,185,255);
    }
    rect(0,0,unit,unit);
    // fill(30,30,30);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,150,100,angryOpacity*255);
    }else if(sad>sadOffset&&((-1.34>=sadColorFrameCount&&sadColorFrameCount>-1.51))){
      fill(11,57,72);
    }
    arc(0,0,unit,unit,0,90);
    arc(0,unit,unit,unit,270,0);
    arc(unit,0,unit,unit,90,180);
    arc(unit,unit,unit,unit,180,270);
    pop();
     //3-7
     push();
     noStroke();
     translate(unit*6,0);
     // fill(100,100,100);
     if(happy>happyOffset){
       fill(233,255,255,happyOpacity*255);
     }else if(angry>angryOffset){
       fill(200,50,100,angryOpacity*255);
     }else if(sad>sadOffset&&(-2.10>=sadColorFrameCount&&sadColorFrameCount>-2.30)){
       fill(11,57,72);
     }
     rect(0,0,unit,unit);
     pop();
  pop();

  //4번째줄
  push();
  translate(0,unit*3);
    //4-1
    push();
    noStroke();
    // fill(30,30,30);
    if(happy>happyOffset){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&(1.9>=sadColorFrameCount&&sadColorFrameCount>1.72)){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    // fill(150,150,130);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(0,221,75,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&(1.9>=sadColorFrameCount&&sadColorFrameCount>1.72)){
      fill(89,145,201);
    }
    arc(0,unit/2,unit,unit,270,90);
    pop();
    //4-2
    push();
    noStroke();
    translate(unit,0);
    // fill(150,150,150);
    if(happy>happyOffset){
      fill(42,229,208,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,50,angryOpacity*255);
    }else if(sad>sadOffset&&(1.21>=sadColorFrameCount&&sadColorFrameCount>1.04)){
      fill(89,145,201);
    }
    rect(0,0,unit,unit);
    pop();
    //4-3
    push();
    noStroke();
    translate(unit*2,0);
    // fill(200,200,200);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,236,0,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,100,angryOpacity*255);
    }else if(sad>sadOffset&&((0.53>=sadColorFrameCount&&sadColorFrameCount>0.36))){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    // fill(150,150,130);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&((0.53>=sadColorFrameCount&&sadColorFrameCount>0.36))){
      fill(142,185,255);
    }
    arc(unit/2,unit,unit,unit,180,0)
    pop();
    //4-4
    push();
    noStroke();
    translate(unit*3,0);
    // fill(30,30,30);
    if(happy>happyOffset){
      fill(143,235,150,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.15>=sadColorFrameCount&&sadColorFrameCount>-0.32))){
      fill(11,57,72);
    }
    rect(0,0,unit,unit);
    push();
    // fill(150,150,150);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(42,229,208,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,50,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.15>=sadColorFrameCount&&sadColorFrameCount>-0.32))){
      fill(112,105,150);
    }
    for(let i=0; i<unit; i+=10){
      rect(i,0,2,i)
    }
    pop();
    pop();
    //4-5
    push();
    noStroke();
    translate(unit*4,0);
    // fill(150,150,150);
    if(happy>happyOffset){
      fill(0,221,75,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(200,50,100,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.83>=sadColorFrameCount&&sadColorFrameCount>-1.0))){
      fill(142,185,255);
    }
    rect(0,0,unit,unit);
    // fill(50,50,50);
    if(happy>happyOffset){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(255,100,50,angryOpacity*255);
    }else if(sad>sadOffset&&((-0.83>=sadColorFrameCount&&sadColorFrameCount>-1.0))){
      fill(89,145,201);
    }
    arc(unit/2,0,unit,unit,0,180);
    pop();
    //4-6
    push();
    noStroke();
    translate(unit*5,0);
    // fill(100,100,100);
    if(happy>happyOffset){
      fill(233,255,255,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&((-1.51>=sadColorFrameCount&&sadColorFrameCount>=-1.70))){
      fill(142,185,255);
    }
    rect(0,0,unit,unit);
    pop();
    //4-7
    push();
    noStroke();
    translate(unit*6,0);
    // fill(30,30,30);
    if(happy>happyOffset){
      fill(255,86,102,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(248,152,224,angryOpacity*255);
    }else if(sad>sadOffset&&(-2.30>=sadColorFrameCount&&sadColorFrameCount>=-2.4)){
      fill(112,105,150);
    }
    rect(0,0,unit,unit);
    // fill(150,150,130);
    if(happy>happyOffset||surprised>surprisedOffset1){
      fill(0,221,75,happyOpacity*255);
    }else if(angry>angryOffset){
      fill(253,16,35,angryOpacity*255);
    }else if(sad>sadOffset&&(-2.30>=sadColorFrameCount&&sadColorFrameCount>-2.4)){
      fill(89,145,201);
    }
    arc(0,unit/2,unit,unit,270,90);
    pop();
  pop();
}

function anim_ellipses(반지름) {
  let r = sin(frameCount)*20
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

function surprisedColor (surprised){
  const unit = windowWidth/7;
  const suprisedForColor = map(surprised, 0, windowWidth, 150,255);
  if(surprised>20){
    push();
    if(surprised<unit*0.5){
      //1번째줄
      push();
      fill(230,200,suprisedForColor);
      translate(unit/2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //2번째줄
      translate(0,unit);
      push();
      fill(200,suprisedForColor,50);
      translate(unit/2+unit,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //3번째줄
      translate(0,unit);
      push();
      fill(suprisedForColor,200,50);
      translate(unit/2+unit*2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //4번째줄
      translate(0,unit);
      push();
      fill(200,200,50);
      translate(unit/2+unit*3,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
    }else if(surprised<unit*2.7){
      //1번째줄
      push();
      fill(230,200,suprisedForColor);
      translate(unit/2+unit,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //2번째줄
      translate(0,unit);
      push();
      fill(200,suprisedForColor,50);
      translate(unit/2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //3번째줄
      translate(0,unit);
      push();
      fill(suprisedForColor,200,50);
      translate(unit/2+unit*3,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //4번째줄
      translate(0,unit);
      push();
      fill(200,200,50);
      translate(unit/2+unit*2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
    }
    else if(surprised<unit*3.7){
      push();
      fill(230,200,suprisedForColor);
      translate(unit/2+unit*2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //2번째줄
      translate(0,unit);
      push();
      fill(200,suprisedForColor,50);
      translate(unit/2+unit*5,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //3번째줄
      translate(0,unit);
      push();
      fill(suprisedForColor,200,50);
      translate(unit/2+unit*4,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //4번째줄
      translate(0,unit);
      push();
      fill(200,200,50);
      translate(unit/2+unit,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
    }
    else if(surprised<unit*5.5){
      push();
      fill(230,200,suprisedForColor);
      translate(unit/2+unit*3,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //2번째줄
      translate(0,unit);
      push();
      fill(200,suprisedForColor,50);
      translate(unit/2+unit*4,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //3번째줄
      translate(0,unit);
      push();
      fill(suprisedForColor,200,50);
      translate(unit/2+unit*5,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //4번째줄
      translate(0,unit);
      push();
      fill(200,200,50);
      translate(unit/2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
    }
    else if(surprised<unit*6){
      push();
      fill(230,200,suprisedForColor);
      translate(unit/2+unit*4,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //2번째줄
      translate(0,unit);
      push();
      fill(200,suprisedForColor,50);
      translate(unit/2+unit*3,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //3번째줄
      translate(0,unit);
      push();
      fill(suprisedForColor,200,50);
      translate(unit/2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //4번째줄
      translate(0,unit);
      push();
      fill(200,200,50);
      translate(unit/2+unit*5,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
    }
    else{
      push();
      fill(230,200,suprisedForColor);
      translate(unit/2+unit*5,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //2번째줄
      translate(0,unit);
      push();
      fill(200,suprisedForColor,50);
      translate(unit/2+unit*2,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //3번째줄
      translate(0,unit);
      push();
      fill(suprisedForColor,200,50);
      translate(unit/2+unit,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
      //4번째줄
      translate(0,unit);
      push();
      fill(200,200,50);
      translate(unit/2+unit*4,unit/6)
      rotate(45);
      noStroke();
      rect(0,0,unit/2,unit/2,surprised/(unit/10));
      pop();
    }
    pop();
  }
  
}

function basicbg(){
  const unit = windowWidth/7;
   //1-1
   push();
   noStroke();
   fill(0,0,0);
   rect(0,0,unit,unit);
   fill(100,100,100);
   arc(unit/2,unit,unit,unit,180,0);
   pop();
  //1-2
  push();
  noStroke();
  translate(unit,0);
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
  //1-7
  push();
  noStroke();
  translate(unit*6,0);
  fill(0,0,0);
  rect(0,0,unit,unit);
  fill(100,100,100);
  arc(unit/2,unit,unit,unit,180,0);
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
    fill(100,100,100);
    rect(0,0,unit,unit);
    pop();
    //2-7
    push();
    noStroke();
    translate(unit*6,0);
    fill(150,150,130);
    rect(0,0,unit,unit);
    fill(50,50,50);
    arc(unit,unit/2,unit,unit,90,270);
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
    //3-7
    push();
    noStroke();
    translate(unit*6,0);
    fill(100,100,100);
    rect(0,0,unit,unit);
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
    //4-7
    push();
    noStroke();
    translate(unit*6,0);
    fill(30,30,30);
    rect(0,0,unit,unit);
    fill(150,150,130);
    arc(0,unit/2,unit,unit,270,90);
    pop();
  pop();
}

function sadColorBg (sad) {
  const unit = windowWidth/7;
  //1-1
  push();
  noStroke();
  fill(108,5,221);
  rect(0,0,unit,unit);
  fill(159,111,255);
  arc(unit/2,unit,unit,unit,180,0);
  pop();
  //1-2
  push();
  noStroke();
  translate(unit,0);
  fill(129,54, 205);
  rect(0,0,unit,unit);
  pop();
  //1-3
  push();
  noStroke();
  translate(unit*2,0);
  fill(167,91,205);
  rect(0,0,unit,unit);
  fill(159,111,255);
  arc(0,unit,unit*2,unit*2,270,0);
  pop();
  //1-4
  push();
  noStroke();
  translate(unit*3,0);
  fill(108,5,221);
  rect(0,0,unit,unit);
  fill(159,111,255);
  arc(unit,unit/2,unit,unit,90,270);
  pop();
  //1-5
  push();
  noStroke();
  translate(unit*4,0);
  fill(167,91,205);
  rect(0,0,unit,unit);
  pop();
  //1-6
  push();
  noStroke();
  translate(unit*5,0);
  fill(102,57,215);
  rect(0,0,unit,unit);
  fill(129,54, 205)
  arc(unit,0,unit*2,unit*2,90,180);
  pop();
  //1-7
  push();
  noStroke();
  translate(unit*6,0);
  fill(108,5,221);
  rect(0,0,unit,unit);
  fill(159,111,255);
  arc(unit/2,unit,unit,unit,180,0);
  pop();

  //2번째줄
  push();
  translate(0,unit);
    //2-1
    push();
    noStroke();
    fill(167,91,205);
    rect(0,0,unit,unit);
    fill(129,54, 205);
    arc(unit,unit/2,unit,unit,90,270);
    pop();
    //2-2
    push();
    noStroke();
    translate(unit,0);
    fill(159,111,255);
    rect(0,0,unit,unit);
      push();
      fill(165,95,136)
      for(let i=0; i<unit; i+=10){
        rect(i,0,2,unit-i)
      }
      pop();
    pop();
    //2-3
    push();
    noStroke();
    translate(unit*2,0);
    fill(108,5,221);
    rect(0,0,unit,unit);
    fill(159,111,255);
    arc(unit,unit/2,unit,unit,90,270);
    pop();
    //2-4
    push();
    noStroke();
    translate(unit*3,0);
    fill(129,54, 205);
    rect(0,0,unit,unit);
    fill(167,91,205);
    arc(0,unit/2,unit,unit,270,90);
    pop();
    //2-5
    push();
    noStroke();
    translate(unit*4,0);
    fill(159,111,255);
    rect(0,0,unit,unit);
    fill(129,54, 205);
    arc(unit/2,unit,unit,unit,180,0)
    pop();
    //2-6
    push();
    noStroke();
    translate(unit*5,0);
    fill(108,5,221);
    rect(0,0,unit,unit);
    pop();
    //2-7
    push();
    noStroke();
    translate(unit*6,0);
    fill(167,91,205);
    rect(0,0,unit,unit);
    fill(129,54, 205);
    arc(unit,unit/2,unit,unit,90,270);
    pop();
  pop();

  //3번째 줄
  push();
  translate(0,unit*2);
    //3-1
    push();
    noStroke();
    fill(159,111,255);
    rect(0,0,unit,unit);
    pop();
    //3-2
    push();
    noStroke();
    translate(unit,0);
    fill(129,54, 205);
    rect(0,0,unit,unit);
    fill(108,5,221);
    ellipse(unit/2,unit/2,unit);
    pop();
    //3-3
    push();
    noStroke();
    translate(unit*2,0);
    fill(167,91,205);
    rect(0,0,unit,unit);
    pop();
    //3-4
    push();
    noStroke();
    translate(unit*3,0);
    fill(108,5,221);
    rect(0,0,unit,unit);
    fill(159,111,255);
    arc(unit,unit,unit*2,unit*2,180,270);
    pop();
    //3-5
    push();
    noStroke();
    translate(unit*4,0);
    fill(108,5,221);
    rect(0,0,unit,unit);
    fill(167,91,205);
    arc(unit/2,unit,unit,unit,180,0);
    pop();
    //3-6
    push();
    noStroke();
    translate(unit*5,0);
    fill(129,54, 205);
    rect(0,0,unit,unit);
    fill(167,91,205);
    arc(0,0,unit,unit,0,90);
    arc(0,unit,unit,unit,270,0);
    arc(unit,0,unit,unit,90,180);
    arc(unit,unit,unit,unit,180,270);
    pop();
    //3-7
    push();
    noStroke();
    translate(unit*6,0);
    fill(159,111,255);
    rect(0,0,unit,unit);
    pop();
  pop();

  //4번째줄
  push();
  translate(0,unit*3);
    //4-1
    push();
    noStroke();
    fill(108,5,221);
    rect(0,0,unit,unit);
    fill(167,91,205);
    arc(0,unit/2,unit,unit,270,90);
    pop();
    //4-2
    push();
    noStroke();
    translate(unit,0);
    fill(167,91,205);
    rect(0,0,unit,unit);
    pop();
    //4-3
    push();
    noStroke();
    translate(unit*2,0);
    fill(159,111,255);
    rect(0,0,unit,unit);
    fill(108,5,221);
    arc(unit/2,unit,unit,unit,180,0)
    pop();
    //4-4
    push();
    noStroke();
    translate(unit*3,0);
    fill(129,54, 205);
    rect(0,0,unit,unit);
    push();
    fill(159,111,255);
    for(let i=0; i<unit; i+=10){
      rect(i,0,2,i)
    }
    pop();
    pop();
    //4-5
    push();
    noStroke();
    translate(unit*4,0);
    fill(167,91,205);
    rect(0,0,unit,unit);
    fill(108,5,221);
    arc(unit/2,0,unit,unit,0,180);
    pop();
    //4-6
    push();
    noStroke();
    translate(unit*5,0);
    fill(159,111,255);
    rect(0,0,unit,unit);
    pop();
    //4-7
     push();
     noStroke();
     translate(unit*6,0);
     fill(108,5,221);
     rect(0,0,unit,unit);
     fill(167,91,205);
     arc(0,unit/2,unit,unit,270,90);
     pop();
  pop();
}