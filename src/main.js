//greenが左yellowが右
//表示する数字のID
const left_score = document.getElementById("left-score");
const right_score = document.getElementById("right-score");
//ボタンを不活性化させるため
//const //left_anime = document.getElementById("left_anime");
//const //right_anime = document.getElementById("right_anime");
const serialPort_connect = document.getElementById("serialPort_connect");
//数字のアニメーション系
const upper_left_num = document.getElementById("upper_left_num");
const lower_left_num = document.getElementById("lower_left_num");
const upper_right_num = document.getElementById("upper_right_num");
const lower_right_num = document.getElementById("lower_right_num");
//ローカルストレージ用
let L_localInfo = localStorage.getItem("L_count");
let R_localInfo = localStorage.getItem("R_count");

const body = document.body;
const image = document.getElementById("image");
const music = new Audio('./enter_bgm.mp3');
//表示する数字の定義値と色々
let left_up_or_dn = false;
let left_count = 1;
let right_up_or_dn = false;
let right_count = 1;
let left_counter_stop = 1;
let right_counter_stop = 1;
if ("serial" in navigator , "usb" in navigator) {console.log("serial and usb_ready")}

if (L_localInfo) {
  console.log("local:"+L_localInfo,R_localInfo);
  upper_left_num.innerText = L_localInfo;
  upper_right_num.innerText = R_localInfo;
  lower_left_num.innerText = L_localInfo - 1;
  lower_right_num.innerText = R_localInfo - 1;
  left_count = L_localInfo;
  right_count = R_localInfo;
}

serialPort_connect.onclick = async function serialPort_btn() {
  try {
    const filters = [{ usbVendorId: 0x0d28, usbProductId: 0x0204 }];
    const port = await navigator.serial.requestPort({filters});
    await port.open({ baudRate: 115200 });
    console.log("portOpen!");
    while (port.readable) {
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log("Canceled");
            break;
          }
          const decodeValue = new TextDecoder().decode(value);
          console.log("nomal" + value);
          if (RegExp("Y").test(decodeValue)) {
            console.log(`yellow_microbit${decodeValue}`);
            wait('yellow_counter');
          }else if (RegExp("G").test(decodeValue)) {
            console.log(`green_microbit${decodeValue}`);
            wait('green_counter');
          }
        }
      } catch (error) {
        console.error(`usb_link_error\n"${error}"`);
      } finally {
        reader.releaseLock();
      }
    }
  } catch (error) {
    console.error(`usb_link_error\n"${error}"`);
  }
}

//lowerがfalse
function wait(func) {
  console.log(func);
  if (func == 'green_counter') {
    console.log(left_counter_stop);
    if (left_counter_stop >= 1) {
      left_counter_stop = left_counter_stop + 1000;
    }
    setTimeout(`green_counter(1000);left_back_color();`, left_counter_stop);

  }else if (func == 'yellow_counter') {
    console.log(left_counter_stop);
    if (right_counter_stop >= 1) {
      right_counter_stop = right_counter_stop + 1000;
    }
    setTimeout("yellow_counter(1000);right_back_color();", right_counter_stop);
  }
}

function green_counter(stop_num){
  left_counter_stop = stop_num
  return new Promise(resolve => {
    left_count++;
    setLocal();
    music.play();
    if(left_up_or_dn == false){
      left_score.classList.add("text_slide");
      left_up_or_dn = true;
      //left_anime.disabled = true
      setTimeout(()=>{
        //left_anime.disabled = false
        lower_left_num.innerText = left_count;
      }, 300);
    }else if(left_up_or_dn == true){
      left_up_or_dn = false;
      left_score.classList.remove("text_slide");
      //left_anime.disabled = true
      setTimeout(()=>{
        //left_anime.disabled = false
        upper_left_num.innerText = left_count;
      }, 300);
    }
    setTimeout(()=>{resolve();left_counter_stop = 1}, 1000);
  });
}


function yellow_counter(stop_num){
  right_counter_stop = stop_num
  return new Promise(resolve => {
    right_count++;
    setLocal();
    music.play();
    if(right_up_or_dn == false){
      right_up_or_dn = true;
      right_score.classList.add("text_slide");
      //right_anime.disabled = true
      setTimeout(()=>{
        //right_anime.disabled = false
        lower_right_num.innerText = right_count;
      }, 300);
    }else if(right_up_or_dn == true){
      right_up_or_dn = false;
      right_score.classList.remove("text_slide");
      //right_anime.disabled = true
      setTimeout(()=>{
        //right_anime.disabled = false
        upper_right_num.innerText = right_count;
      }, 300);
    }
    setTimeout(()=>{resolve();right_counter_stop = 1}, 1000);
  });
}

function left_back_color() {
  body.classList.add("body_transition");
  left_score.classList.add("score_point_transition");
  image.classList.add("image_transition");
  setTimeout(()=>{
    body.classList.remove("body_transition");
    left_score.classList.remove("score_point_transition");
    image.classList.remove("image_transition");
  }, 1000);
}
function right_back_color() {
  body.classList.add("body_transition");
  right_score.classList.add("score_point_transition");
  image.classList.add("image_transition");
  setTimeout(()=>{
    body.classList.remove("body_transition");
    right_score.classList.remove("score_point_transition");
    image.classList.remove("image_transition");
  }, 1000);
}

function setLocal() {
  console.log(L_localInfo,R_localInfo,left_count,right_count)
  let new_left_count = left_count;
  let new_right_count = right_count;
  localStorage.setItem("L_count", new_left_count);
  localStorage.setItem("R_count", new_right_count)
}

function resetLocal() {
  localStorage.removeItem("L_count");
  localStorage.removeItem("R_count");
  left_count = 1;
  right_count = 1;
  upper_left_num.innerText = 1;
  upper_right_num.innerText = 1;
  lower_left_num.innerText = 0;
  lower_right_num.innerText = 0;
  left_score.classList.remove("text_slide");
  right_score.classList.remove("text_slide");
}

let btnOF = true
function hidden_btn() {
  if (btnOF) {
    body.style.overflow = "";
    btnOF = false
  }else {
    body.style.overflow = "hidden";
    btnOF = true
  }
}