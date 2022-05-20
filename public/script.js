//import Peer from 'peerjs';
const socket = io('/')
const videoGrid=document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3002'
})

const myVideo=document.createElement('video')
myVideo.muted=true

const peers= {}

navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true,
}).then(stream=>{
  addVideoStream(myVideo,stream)

  myPeer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
  })

  socket.on('user-connected',userId=>{
    connectToNewUser(userId,stream)
  })

})

socket.on('user-connected',userId=>{
 // console.log(userId)
 if (peers[userId])peers[userId].close()
})
 
myPeer.on('open',id=>{
  //console.log("12")
    socket.emit('join-room', ROOM_ID,id);
  })
  function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
      video.remove()
    })
    peers[userId]=call
  }




function addVideoStream(video,stream){
  video.srcObject = stream
  video.addEventListener('loadedmetadata',()=>{
    video.play()
  })
  videoGrid.append(video)
}