// pusher.js
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.APPID,      // Replace with your Pusher App ID
  key: process.env.KEY,        // Replace with your Pusher App Key
  secret: process.env.SECRET,  // Replace with your Pusher App Secret
  cluster: process.env.CLUSTER, // Replace with your Pusher App Cluster
  useTLS: true,
})

export default pusher