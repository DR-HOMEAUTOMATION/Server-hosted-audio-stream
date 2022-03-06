const mic = require('mic')
const fs = require('fs') 
const express = require('express')

const router = express.Router();


// should look something like this: 

router.get('/',(req,res,next)=>{
	res.setHeader('Content-Type','audio/wave')
  const micInstance = mic({
	rate:16000,
	channels:'1',
	debug:true,
	exitOnSilence:10,
	device:'hw:1,0',
	fileType: 'wav'
  })
  const micInput = micInstance.getAudioStream()
	micInput.pipe(res)
  micInput.on('silence',()=>{
	console.log('Sending data now!')
	micInstance.stop();
  });

	micInput.on('error',(err)=>console.log(err));	
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
