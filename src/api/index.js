const mic = require('mic')
const fs = require('fs') 
const express = require('express');

const router = express.Router();

const micInstance = mic({
  rate:16000,
  channels:'1',
  debug:true,
  exitOnSilence:10,
})


// should look something like this: 

router.get('/',(req,res,next)=>{
  const micInput = micInstance.getAudioStream()
  micInput.pipe(res);
  micInput.on('processExitComplete',()=>{
    res.send(); 
  })
  micInstance.start();
})

// Example: stream audio file
// router.get('/', (req, res) => {
//   res.header({
//     "Content-Type":"audio/mpeg"
//   })
//   let micInputStream = fs.createReadStream('/Users/dawson/workspace/homeAutomation/Server-hosted-audio-stream/20220302 053008.m4a')
//     micInputStream.on('open',()=>{
//       micInputStream.pipe(res)
//     })
//     micInputStream.on('end',()=>{
//       res.send()
//     })
// });


module.exports = router;
