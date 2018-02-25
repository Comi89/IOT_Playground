var five = require("johnny-five");
var board = new five.Board();
var PubNub = require('pubnub')

board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });

  var led = new five.Led(3);

  // Initialize cloud server
  var pubnub = new PubNub({
      publishKey : 'pub-c-eefe9787-ad53-4e7c-b6cf-267a2b78c06d',
      subscribeKey : 'sub-c-ab01e856-bfbb-11e7-9d68-9ad7add0a6e8'
  })
  var change = "";
  proximity.on("data", function() {
    // send data to cloud
    pubnub.subscribe({ channels: ['distance'] });
    if(this.cm < 20){
      led.on();
      if(change === "green" || change === ""){
        pubnub.publish({ channel: 'distance', message: "red" }, (publishStatus)=>{
        if (publishStatus.error) {
        console.error('Non 200 response');
        return ;
        }
        console.log('I just published my hello!');
        change = "red";

        });
      }

    }else if(this.cm > 20){
      led.off();
      if(change === "red" || change === ""){
        pubnub.publish({ channel: 'distance', message: "green" }, (publishStatus)=>{
        if (publishStatus.error) {
        console.error('Non 200 response');
        return ;
        }
        console.log('Distance published!');
        change = "green";

        });
      }

    }
  });

  proximity.on("change", function() {

  });
});
