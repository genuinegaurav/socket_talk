import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//side bar user 
export const getUsersForSidebar = async (req, res) => {
  try {
    //since the protected route hence req contain the user 
    const loggedInUserId = req.user._id;
    //not to show th logged in user the side bar hence filter out and password removed from displaying 
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get the message bw two users 
export const getMessages = async (req, res) => {
  try {
    //user to chat with
    const { id: userToChatId } = req.params;
    //current user 
    const myId = req.user._id;

    //finding all the message if the send id senderid and receiver id is myID vicevrsa 
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });


    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//exchangin of messaage and image bw users
export const sendMessage = async (req, res) => {
  try {
     
    //image or text from the user 
    const { text, image } = req.body;

    //recivedID from url
    const { id: receiverId } = req.params;

    //my id
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    //saving the message 
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //finding the user from prama to send the message then findinf the socket id of that user 
    const receiverSocketId = getReceiverSocketId(receiverId);

    //emitting the message to the seelcted user 
    if (receiverSocketId) {
      //to the selected user 
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};